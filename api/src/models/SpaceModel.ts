import { Model, PipelineStage, Schema, Types, model } from 'mongoose';
import { CleanMongoSpace, ZodMongoSpaceShape } from 'shared';
import { zodValidateWithErrors } from '@ptolemy2002/regex-utils';

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

export type SpaceStaticMethods = {
    executeDocumentAggregation(pipeline: PipelineStage[]): Promise<CleanMongoSpace[]>
};

type SpaceModel = Model<MongoDocumentSpace, {}, SpaceInstanceMethods>;
const SpaceSchema = new Schema<MongoDocumentSpace, {}, SpaceInstanceMethods>({
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
        default: [],
        validate: zodValidateWithErrors(ZodMongoSpaceShape.aliases)
    },
    tags: {
        type: [
            {
                type: String,
                match: /^[a-zA-Z0-9_-]+$/,
                lowercase: true,
                trim: true
            }
        ],
        default: [],
        validate: zodValidateWithErrors(ZodMongoSpaceShape.tags)
    }
});

SpaceSchema.method("toClientJSON", function() {
    const {_id, ...space} = this.toJSON();
    delete space.__v;
    return {
        _id: _id.toString(),
        ...space
    };
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

export type SpaceModelWithStatics = Model<MongoDocumentSpace, {}, SpaceInstanceMethods> & SpaceStaticMethods;

const SpaceModel = model<MongoDocumentSpace, SpaceModelWithStatics>('spaces', SpaceSchema);
SpaceModel.executeDocumentAggregation = function(pipeline: PipelineStage[]) {
    return SpaceModel.aggregate<CleanMongoSpace>(pipeline).exec();
}

export default SpaceModel;