import { Model, PipelineStage, Schema, Types, model } from 'mongoose';
import { CleanMongoSpace, ZodMongoSpaceShape } from 'shared';
import { zodValidateWithErrors } from '@ptolemy2002/regex-utils';
import { refineNoAliasMatchingName } from 'shared';

export type MongoDocumentSpace =
    // Here we're manually defining the _id field an ObjectId
    // instance, as that's what mongoose has in the object
    // itself. However, whenever we respond to the client, we
    // will convert it to match the string format.
    Omit<CleanMongoSpace, "_id"> & { 
        _id: Types.ObjectId

        // This is the version key that
        // mongoose uses. It's not relevant
        // in most caseswe're using here.
        __v?: number
    }
;

export type SpaceInstanceMethods = {
    toClientJSON(): CleanMongoSpace;
    makeNameUnique(): Promise<void>;
    removeUnsetFields(): void;
};

export type SpaceModel = Model<MongoDocumentSpace, {}, SpaceInstanceMethods>;

export interface SpaceModelWithStatics extends SpaceModel {
    executeDocumentAggregation(pipeline: PipelineStage[]): Promise<CleanMongoSpace[]>;
    getPaths(): string[];
}

// Validation is done in custom validators, as they access more context.
const SpaceSchema = new Schema<MongoDocumentSpace, SpaceModel, SpaceInstanceMethods>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: null,
    },
    examples: {
        type: [
            {
                type: String,
                trim: true
            }
        ],
        default: []
    },
    aliases: {
        type: [
            {
                type: String,
                trim: true
            }
        ],
        default: []
    },
    tags: {
        type: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],
        default: []
    }
});

SpaceSchema.path("name").validate(zodValidateWithErrors(ZodMongoSpaceShape.name, true));
SpaceSchema.path("description").validate(zodValidateWithErrors(ZodMongoSpaceShape.description, true));
SpaceSchema.path("examples").validate(zodValidateWithErrors(ZodMongoSpaceShape.examples, true));

SpaceSchema.path("aliases").validate(function(aliases: string[]) {
    zodValidateWithErrors(ZodMongoSpaceShape.aliases, true)(aliases);
    return refineNoAliasMatchingName(this.name, aliases);
}, "The aliases must be unique and not include the name of the space.");

SpaceSchema.path("tags").validate(zodValidateWithErrors(ZodMongoSpaceShape.tags, true));

SpaceSchema.method("toClientJSON", function() {
    const {_id, ...space} = this.toJSON();
    delete space.__v;
    return {
        _id: _id.toString(),
        ...space
    };
});

SpaceSchema.method("makeNameUnique", async function() {
    // See if the name is unique
    const existingNames = await SpaceModel.distinct("name");

    let name = this.get("name").replace(/\([0-9]+\)$/, "").trim();
    const originalName = name;

    // Find the first available name
    let i = 1;
    while(existingNames.includes(name)) {
        name = `${originalName} (${i})`;
        i++;
    }

    this.set("name", name);
});

SpaceSchema.method("removeUnsetFields", function() {
    // Remove nulls from lists that should not have nullable items
    this.set("examples", this.get("examples").filter(x => x !== null));
    this.set("tags", this.get("tags").filter(x => x !== null));
    this.set("aliases", this.get("aliases").filter(x => x !== null));
});

SpaceSchema.static("executeDocumentAggregation", function(pipeline: PipelineStage[]) {
    return this.aggregate<CleanMongoSpace>(pipeline).exec();
});

SpaceSchema.static("getPaths", function() {
    return Object.keys(this.schema.paths);
});

// Define the search index for the spaces collection
SpaceSchema.searchIndex({
    name: "default_spaces",
    definition: {
        mappings: {
            dynamic: true
        }
    }
});

SpaceSchema.pre('validate', async function(next) {
    this.removeUnsetFields();
    await this.save({ validateBeforeSave: false });
    next();
});

const SpaceModel = model<MongoDocumentSpace, SpaceModelWithStatics>('spaces', SpaceSchema);

export default SpaceModel;