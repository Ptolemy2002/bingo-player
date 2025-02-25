import { MongoSpaceWithScore } from "src/Api";
import { CleanMongoSpace, SpaceQueryProp, ZodSpaceSchema, ZodMongoSpaceSchema, CleanSpace, MongoSpace, SpaceQueryPropNonId, SpaceQueryPropWithScore, SpaceQueryPropNonIdWithScore, Space} from "./Zod";
import { OptionalValueCondition, valueConditionMatches, ValueOf } from "@ptolemy2002/ts-utils";

export function interpretSpaceQueryProp(prop: SpaceQueryProp): (keyof CleanMongoSpace) | "known-as" {
    if (prop === "id") prop = "_id";
    if (prop === "tag") prop = "tags";
    if (prop === "alias") prop = "aliases";
    if (prop === "example") prop = "examples";
    return prop;
}

export function interpretSpaceQueryPropNonId(prop: SpaceQueryPropNonId): (Exclude<keyof CleanMongoSpace, "id" | "_id">) | "known-as" {
    if (prop === "tag") prop = "tags";
    if (prop === "alias") prop = "aliases";
    if (prop === "example") prop = "examples";
    return prop;
}

export function interpretSpaceQueryPropWithScore(prop: SpaceQueryPropWithScore): (keyof MongoSpaceWithScore) | "known-as" {
    if (prop === "id") prop = "_id";
    if (prop === "tag") prop = "tags";
    if (prop === "alias") prop = "aliases";
    if (prop === "example") prop = "examples";
    if (prop === "score") prop = "_score";
    return prop;
}

export function interpretSpaceQueryPropWithScoreNonId(prop: SpaceQueryPropNonIdWithScore): (Exclude<keyof MongoSpaceWithScore, "id" | "_id">) | "known-as" {
    if (prop === "tag") prop = "tags";
    if (prop === "alias") prop = "aliases";
    if (prop === "example") prop = "examples";
    if (prop === "score") prop = "_score";
    return prop;
}

// The clean functions will populate values for all optional
// fields and perform transformations such as trimming strings
// and converting tags to lowercase.
export function cleanSpace(space: Space): CleanSpace {
    return ZodSpaceSchema.parse(space);
}

export function cleanMongoSpace(mongoSpace: MongoSpace): CleanMongoSpace {
    return ZodMongoSpaceSchema.parse(mongoSpace);
}

// Simple type guards
export function isSpace(v: unknown): v is Space {
    return ZodSpaceSchema.safeParse(v).success;
}

export function isMongoSpace(v: unknown): v is MongoSpace {
    return ZodMongoSpaceSchema.safeParse(v).success;
}

// These conversion functions will also do cleaning for us
export function toSpace(space: MongoSpace | Space): CleanSpace {
    const {success, data} = ZodSpaceSchema.safeParse(space);
    if (success) {
        return data;
    }

    // Zod doesn't do type guards, so we need to tell
    // TypeScript that the space is a MongoSpace.
    const {_id, examples, aliases, tags, ...rest} = space as MongoSpace;
    return cleanSpace({
        id: _id,
        examples: examples && new Set(examples),
        aliases: aliases && new Set(aliases),
        tags: tags && new Set(tags),
        ...rest
    });
}

export function toMongoSpace(space: MongoSpace | Space): CleanMongoSpace {
    const {success, data} = ZodMongoSpaceSchema.safeParse(space);
    if (success) {
        return data;
    }

    // Zod doesn't do type guards, so we need to tell
    // TypeScript that the space is a Space.
    const {id, examples, aliases, tags, ...rest} = space as Space;
    return cleanMongoSpace({
        _id: id,
        examples: examples && [...examples],
        aliases: aliases && [...aliases],
        tags: tags && [...tags],
        ...rest
    });
}

export const MongoSpacePaths = [
    "_id",
    "name",
    "description",

    "examples",
    "examples.<number>",

    "aliases",
    "aliases.<number>",

    "tags",
    "tags.<number>"
] as const;

export function parseSpacePath(
    input: string,
    pathCondition: OptionalValueCondition<ValueOf<typeof MongoSpacePaths>> = null
): boolean {
    const inputWords = input.split(".");
    
    const paths = MongoSpacePaths.filter(p => valueConditionMatches(p, pathCondition));
    for (const path of paths) {
        const pathWords = path.split(".");
        if (inputWords.length !== pathWords.length) continue;

        let match = true;
        for (let i = 0; i < inputWords.length; i++) {
            if (pathWords[i] === "<number>") {
                if (!(/^\d+$/.test(inputWords[i]))) {
                    match = false;
                    break;
                }
            } else if (pathWords[i] === "<string>") {
                if (inputWords[i] === "") {
                    match = false;
                    break;
                }
            } else if (pathWords[i] !== inputWords[i]) {
                match = false;
                break;
            }
        }

        if (match) return true;
    }

    return false;
}