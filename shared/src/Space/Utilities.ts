import { CleanMongoSpace, SpaceQueryProp, ZodSpaceSchema, ZodMongoSpaceSchema, Space, CleanSpace, MongoSpace} from "./Zod";

export function interpretSpaceQueryProp(prop: SpaceQueryProp): (keyof CleanMongoSpace) | "known-as" {
    if (prop === "id") prop = "_id";
    if (prop === "tag") prop = "tags";
    if (prop === "alias") prop = "aliases";
    if (prop === "example") prop = "examples";
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
    const {_id, ...rest} = space as MongoSpace;
    return cleanSpace({
        id: _id,
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
    const {id, ...rest} = space as Space;
    return cleanMongoSpace({
        _id: id,
        ...rest
    });
}