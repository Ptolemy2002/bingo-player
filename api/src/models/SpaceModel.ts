import { HydratedDocumentFromSchema, Model, PipelineStage, Schema, Types, model } from 'mongoose';
import { CleanMongoSpace, ZodMongoSpaceShape } from 'shared';
import { zodValidateWithErrors } from '@ptolemy2002/regex-utils';
import { refineNoAliasMatchingName } from 'shared';
import { omit } from '@ptolemy2002/ts-utils';

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
    getUniqueName(name: string): Promise<string>;
    createWithUniqueName(name: string, space: Omit<CleanMongoSpace, "_id" | "name">): Promise<
        HydratedDocumentFromSchema<typeof SpaceSchema>
    >;
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

SpaceSchema.path("name").validate(zodValidateWithErrors(ZodMongoSpaceShape.name, { _throw: true, prefix: "name" }));
SpaceSchema.path("description").validate(zodValidateWithErrors(ZodMongoSpaceShape.description, { _throw: true, prefix: "description" }));
SpaceSchema.path("examples").validate(zodValidateWithErrors(ZodMongoSpaceShape.examples, { _throw: true, prefix: "examples" }));

SpaceSchema.path("aliases").validate(function(aliases: string[]) {
    zodValidateWithErrors(ZodMongoSpaceShape.aliases, { _throw: true })(aliases);
    return refineNoAliasMatchingName(this.name, aliases);
}, "The aliases must be unique and not include the name of the space.");

SpaceSchema.path("tags").validate(zodValidateWithErrors(ZodMongoSpaceShape.tags, { _throw: true, prefix: "tags" }));

SpaceSchema.method("toClientJSON", function() {
    const {_id, ...space} = omit(this.toJSON(), "__v");
    
    return {
        _id: _id.toString(),
        ...space
    };
});

SpaceSchema.static("getUniqueName", async function(name: string) {
    // See if the name is unique
    const existingNames = await SpaceModel.distinct("name");
    const originalName = name.replace(/\s*\([0-9]+\)$/, "");

    // Find the first available name
    let i = 1;
    while(existingNames.includes(name)) {
        name = `${originalName} (${i})`;
        i++;
    }

    return name;
});

SpaceSchema.static("createWithUniqueName", async function(
    name: string, space: Omit<CleanMongoSpace, "name" | "_id">
) {
    const uniqueName = await SpaceModel.getUniqueName(name);
    return SpaceModel.create({
        ...space,
        name: uniqueName
    });
});

SpaceSchema.method("makeNameUnique", async function() {
    const name = await SpaceModel.getUniqueName(this.get("name"));
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

const SpaceModel = model<MongoDocumentSpace, SpaceModelWithStatics>('spaces', SpaceSchema);

export default SpaceModel;