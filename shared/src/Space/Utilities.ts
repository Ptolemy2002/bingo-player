import { MongoSpaceWithScore } from "src/Api";
import { CleanMongoSpace, SpaceQueryProp, ZodSpaceSchema, ZodMongoSpaceSchema, CleanSpace, MongoSpace, SpaceQueryPropNonId, SpaceQueryPropWithScore, SpaceQueryPropNonIdWithScore, Space} from "./Zod";

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

// 0 indicates the key can have a number as one of its key values
export const MongoSpaceChildPathLookup: Readonly<Record<keyof MongoSpace, (0 | string)[]>> = {
    _id: [],
    name: [],
    description: [],
    examples: [0],
    aliases: [0],
    tags: [0]
} as const;

export function parseSpacePath(
    path: string,
    allowed?: {
        key: keyof MongoSpace,
        allowDirect?: boolean,
        allowNested?: boolean
    }[]
): boolean {
    if (!allowed) allowed = Object.keys(MongoSpaceChildPathLookup).map(key => ({key: key as keyof MongoSpace}));

    const pattern = `^(${
        allowed.map(({key}) => key).join("|")
    })(\.([^\.]+))?`;
    const regex = new RegExp(pattern);

    const match = path.match(regex);
    if (!match) return false;

    const [, key,, value] = match;
    const {
        allowDirect: allowedDirect = true,
        allowNested: allowedNested = true
    } = allowed.find(({key: k}) => k === key) ?? {};

    if (value === undefined) return allowedDirect;

    const lookup = MongoSpaceChildPathLookup[key as keyof MongoSpace];
    if (lookup === undefined) return false;

    if (allowedNested && lookup.includes(0)) {
        try {
            parseInt(value);
            return true;
        } catch {
            return lookup.includes(value);
        }
    }

    return allowedNested && lookup.includes(value);
}