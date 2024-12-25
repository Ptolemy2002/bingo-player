import { SpaceQueryPropEnum } from "./Other";

const ExampleValues = {
    id: "abc123",
    name: "My Space",
    description: "This is a space",
    examples: ["Example 1", "Example 2"],
    aliases: ["Alias 1", "Alias 2"],
    tags: ["tag-1", "tag-2"]
} as const;

export const SwaggerSpaceSchema = {
    $id: ExampleValues.id,
    $name: ExampleValues.name,
    description: ExampleValues.description,
    examples: ExampleValues.examples,
    aliases: ExampleValues.aliases,
    tags: ExampleValues.tags
} as const;

export const SwaggerCleanSpaceSchema = {
    $id: ExampleValues.id,
    $name: ExampleValues.name,
    $description: ExampleValues.description,
    $examples: ExampleValues.examples,
    $aliases: ExampleValues.aliases,
    $tags: ExampleValues.tags
} as const;

export const SwaggerMongoSpaceSchema = {
    $_id: ExampleValues.id,
    $name: ExampleValues.name,
    description: ExampleValues.description,
    examples: ExampleValues.examples,
    aliases: ExampleValues.aliases,
    tags: ExampleValues.tags
} as const;

export const SwaggerCleanMongoSpaceSchema = {
    $_id: ExampleValues.id,
    $name: ExampleValues.name,
    $description: ExampleValues.description,
    $examples: ExampleValues.examples,
    $aliases: ExampleValues.aliases,
    $tags: ExampleValues.tags
} as const;

export const SwaggerSpaceQueryPropSchema = {
    "@enum": SpaceQueryPropEnum
} as const;


export const SwaggerSpaceQueryPropNonIdSchema = {
    "@enum": SpaceQueryPropEnum.filter(prop => prop !== "id" && prop !== "_id")
} as const;