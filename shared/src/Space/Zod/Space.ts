import { swaggerRegistry } from "src/Swagger";
import { z } from "zod";
import { ZodSpaceIDSchema } from "./SpaceID";
import { ZodSpaceNameSchema } from "./SpaceName";
import { ZodSpaceDescriptionSchema } from "./SpaceDescription";
import { ZodSpaceExampleSchema } from "./SpaceExample";
import { ZodSpaceTagSchema } from "./SpaceTag";
import { findAliasMatchingNameIndex, refineNoAliasMatchingName } from "../Other";

export const ZodCleanSpaceSchema = swaggerRegistry.register(
    "CleanSpace",
    z.object({
        id: ZodSpaceIDSchema,
        name: ZodSpaceNameSchema,
        description: ZodSpaceDescriptionSchema,

        // The set type is not officially supported by zod-to-openapi, so we have to manually define the OpenAPI schemas
        // as arrays.
        examples: z.set(ZodSpaceExampleSchema)
            .openapi({
                type: "array",
                items: {
                    $ref: "#/components/schemas/SpaceExample"
                },
                description: (
                    "Examples for what could be considered applicable to the space."
                    + " NOTE: Internally, this is a set, but it is represented as an array here"
                    + " for compatibility reasons."
                )
            }),
        aliases: z.set(ZodSpaceNameSchema)
            .openapi({
                type: "array",
                items: {
                    $ref: "#/components/schemas/SpaceName"
                },
                description: (
                    "Aliases for the space."
                    + " NOTE: Internally, this is a set, but it is represented as an array here"
                    + " for compatibility reasons."
                )
            }),
        tags: z.set(ZodSpaceTagSchema)
            .openapi({
                type: "array",
                items: {
                    $ref: "#/components/schemas/SpaceTag"
                },
                description: (
                    "Tags for the space."
                    + " NOTE: Internally, this is a set, but it is represented as an array here"
                    + " for compatibility reasons."
                )
            })
    })
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "A space for a Bingo Board."
    })
);
export const ZodCleanSpaceShape = ZodCleanSpaceSchema._def.schema.shape;

export const ZodSpaceSchema = swaggerRegistry.register(
    "Space",
    ZodCleanSpaceSchema._def.schema.merge(z.object({
        description: ZodCleanSpaceShape.description.default(null),
        examples: ZodCleanSpaceShape.examples.default(new Set()),
        aliases: ZodCleanSpaceShape.aliases.default(new Set()),
        tags: ZodCleanSpaceShape.tags.default(new Set())
    }))
    .superRefine(({ name, aliases }, ctx) => {
        if (!refineNoAliasMatchingName(name, aliases)) {
            const index = findAliasMatchingNameIndex(name, aliases);
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "No alias should match the name.",
                path: ["aliases", index ?? 0]
            });
        }
    })
    .openapi({
        description: "CleanSpace, but with some fields optional and provided sensible defaults."
    })
);
export const ZodSpaceShape = ZodSpaceSchema._def.schema.shape;


export type CleanSpace = z.infer<typeof ZodCleanSpaceSchema>;
export type Space = z.input<typeof ZodSpaceSchema>;
