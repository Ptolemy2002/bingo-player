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
    toClientJSON(): CleanMongoSpace
};

export type SpaceModel = Model<MongoDocumentSpace, {}, SpaceInstanceMethods>;

export interface SpaceModelWithStatics extends SpaceModel {
    executeDocumentAggregation(pipeline: PipelineStage[]): Promise<CleanMongoSpace[]>
    getPaths(): string[]
}

const SpaceSchema = new Schema<MongoDocumentSpace, SpaceModel, SpaceInstanceMethods>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: zodValidateWithErrors(ZodMongoSpaceShape.name)
    },
    description: {
        type: String,
        default: null,
        validate: zodValidateWithErrors(ZodMongoSpaceShape.description)
    },
    examples: {
        type: [
            {
                type: String,
                trim: true
            }
        ],
        default: [],
        validate: zodValidateWithErrors(ZodMongoSpaceShape.examples)
    },
    aliases: {
        type: [
            {
                type: String,
                trim: true
            }
        ],
        default: []
        // We're going to validate this in a custom validator that has access to greater context
    },
    tags: {
        type: [
            {
                type: String,
                lowercase: true,
                trim: true
            }
        ],
        default: [],
        validate: zodValidateWithErrors(ZodMongoSpaceShape.tags)
    }
});

SpaceSchema.path("aliases").validate(function(aliases: string[]) {
    return (
        zodValidateWithErrors(ZodMongoSpaceShape.aliases)(aliases)
            &&
        refineNoAliasMatchingName(this.name, aliases)
    );
}, "The aliases must be unique and not include the name of the space.");

SpaceSchema.method("toClientJSON", function() {
    const {_id, ...space} = this.toJSON();
    delete space.__v;
    return {
        _id: _id.toString(),
        ...space
    };
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

SpaceSchema.pre('save', async function(next) {
    // See if the name is unique
    const existingNames = await SpaceModel.distinct("name");

    let name = this.get("name");

    // Find the first available name
    let i = 1;
    while(existingNames.includes(name)) {
        name = `${this.get("name")} (${i})`;
        i++;
    }

    this.set("name", name);
    next();
});

const SpaceModel = model<MongoDocumentSpace, SpaceModelWithStatics>('spaces', SpaceSchema);

export default SpaceModel;