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