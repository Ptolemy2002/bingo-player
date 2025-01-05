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

export function refineNoAliasMatchingName(name: string, aliases: string[] | Set<string>): boolean {
    if (aliases instanceof Set) {
        if (aliases.size === 0) return true;
        return !aliases.has(name);
    } else {
        if (aliases.length === 0) return true;
        return !aliases.includes(name);
    }
}
