export const SpaceQueryPropEnum = [
    "id",
    "name",
    "description",
    "examples",
    "aliases",
    "tags",

    "_id",
    "known-as",
    "alias",
    "tag",
    "example"
] as const;

export const SpaceQueryPropWithScoreEnum = [
    ...SpaceQueryPropEnum,
    "score",
    "_score"
] as const;

export function findAliasMatchingNameIndex(name: string, aliases: string[] | Set<string>): number | null {
    if (aliases instanceof Set) {
        if (aliases.size === 0) return null;
        return aliases.has(name) ? Array.from(aliases).indexOf(name) : null;
    } else {
        if (aliases.length === 0) return null;
        const index = aliases.indexOf(name);
        return index === -1 ? null : index;
    }
}

export function refineNoAliasMatchingName(name: string, aliases: string[] | Set<string>): boolean {
    return findAliasMatchingNameIndex(name, aliases) === null;
}
