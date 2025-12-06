import { z, ZodObject } from "zod";
import { registerBingoSchema } from "src/Bingo";
import { ZodBingoSpaceTagConditionSchema } from "./SpaceTagCondition";

export const BingoBoardTemplateExample = {
    id: "Standard 5x5 Template",
    shape: {
        width: 5,
        height: 5
    },
    
    grid: [
        "UCCCU",
        "CCRCC",
        "CRFRC",
        "CCRCC",
        "UCCCU"
    ],

    key: {
        F: {
            type: "exact" as const,
            id: "free-space"
        },

        C: {
            type: "byTag" as const,
            shuffle: true,
            condition: "common"
        },

        U: {
            type: "byTag" as const,
            shuffle: true,
            condition: {
                exclude: ["common"]
            }
        },

        R: {
            type: "byTag" as const,
            shuffle: true,
            condition: ["rare", "legendary"]
        }
    }
};

function zodBingoBoardTemplateKeyEntryBase<T extends BingoBoardKeyEntryType>(
    type: T,
    register: <ZT extends z.ZodType>(s: ZT) => ZT = (s) => s
): ZodObject<{
    type: z.ZodLiteral<T>;
}> {
   return register(z.object({
       type: z.literal(type)
   }));
}

export const ZodBingoBoardTemplateSchema = registerBingoSchema(
    z.object({
        id: registerBingoSchema(
            z.string(),
            {
                id: "BingoBoardTemplate.id",
                type: "prop",
                description: "Unique identifier for the bingo board template. Must be a string.",
                example: BingoBoardTemplateExample.id
            }
        ),
        
        shape: registerBingoSchema(
            z.object({
                width: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoardTemplate.shape.width",
                        type: "prop",
                        description: "Width of the bingo board template. Must be a positive integer.",
                        example: BingoBoardTemplateExample.shape.width
                    }
                ),

                height: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoardTemplate.shape.height",
                        type: "prop",
                        description: "Height of the bingo board template. Must be a positive integer.",
                        example: BingoBoardTemplateExample.shape.height
                    }
                )
            }),
            {
                id: "BingoBoardTemplate.shape",
                type: "prop",
                description: "Dimensions of the bingo board template, specifying its width and height.",
                example: BingoBoardTemplateExample.shape
            }
        ),

        grid: registerBingoSchema(
            z.array(
                z.string().min(1, "Each row in the grid must have at least one character.")
            ).refine((arr) => {
                // Make sure all rows have the same length
                return arr.every(row => row.length === arr[0].length);
            }, {
                message: "All rows in the grid must have the same length."
            }),
            {
                id: "BingoBoardTemplate.grid",
                type: "prop",
                description: "Grid layout of the bingo board template, represented as an array of strings. Each character corresponds to a space type defined in the key.",
                example: BingoBoardTemplateExample.grid
            }
        ),

        key: registerBingoSchema(
            z.record(
                z.string().length(1),
                z.discriminatedUnion("type", [
                    zodBingoBoardTemplateKeyEntryBase("exact", (s) => registerBingoSchema(s, {
                        id: 'BingoBoardTemplate.key.value<"exact">.type',
                        type: "prop",
                        description: "The type of this key entry, in this case 'exact'. Indicates the exact space with this id will be used for the corresponding grid character(s).",
                        example: "exact" as any // Doing an assertion here because Typescript has no way of knowing what ZT is, even though we do.
                    })).extend({
                        id: registerBingoSchema(
                            z.string(),
                            {
                                id: 'BingoBoardTemplate.key.value<"exact">.id',
                                type: "prop",
                                description: "Identifier of the exact space type for this key entry. Must be a string.",
                                example: BingoBoardTemplateExample.key["F"].id
                            }
                        )
                    }),

                    zodBingoBoardTemplateKeyEntryBase("byTag", (s) => registerBingoSchema(s, {
                        id: 'BingoBoardTemplate.key.value<"byTag">.type',
                        type: "prop",
                        description: "The type of this key entry, in this case 'byTag'. Indicates that spaces will be selected based on their tags for the corresponding grid character(s).",
                        example: "byTag" as any // Doing an assertion here because Typescript has no way of knowing what ZT is, even though we do.
                    })).extend({
                        shuffle: registerBingoSchema(
                            z.union([
                                z.stringbool(),
                                z.boolean()
                            ]).default(true),
                            {
                                id: 'BingoBoardTemplate.key.value<"byTag">.shuffle',
                                type: "prop",
                                description: "Whether to shuffle the selected spaces for this key entry when generating the board. " +
                                             "Parses common affirmative and negative strings to booleans, case insensitively. Defaults to true.",
                                examples: [
                                    true, false,
                                    "true", "1", "yes", "on", "y", "enabled",
                                    "false", "0", "no", "off", "n", "disabled"
                                ]
                            }
                        ),

                        condition: registerBingoSchema(
                            ZodBingoSpaceTagConditionSchema,
                            {
                                id: 'BingoBoardTemplate.key.value<"byTag">.condition',
                                type: "prop",
                                description: "Condition to select spaces based on their tags for this key entry. " + 
                                             "Can be a string, an advanced condition object, or an array of strings and/or advanced condition objects.",
                                example: BingoBoardTemplateExample.key["C"].condition
                            }
                        )
                    })
                ])
            ),
            {
                id: "BingoBoardTemplate.key",
                type: "prop",
                description: "Mapping of grid characters to space type definitions, specifying how spaces are selected for each character in the grid.",
                example: BingoBoardTemplateExample.key
            }
        )
    }).superRefine((data, ctx) => {
        // Verify that the grid dimensions match the shape
        const height = data.shape.height;
        const width = data.shape.width;

        if (data.grid.length !== height) {
            ctx.addIssue({
                code: "custom",
                path: ["grid", "length"],
                message: `Grid length (${data.grid.length}) does not match shape height (${height}).`
            });
        }

        if (data.grid[0].length !== width) {
            ctx.addIssue({
                code: "custom",
                path: ["grid", 0, "length"],
                message: `Grid width (${data.grid[0].length}) does not match shape width (${width}).`
            });
        }

        // Get all unique characters used in the grid
        const gridChars = new Set<string>();
        for (const row of data.grid) {
            for (const char of row) {
                gridChars.add(char);
            }
        }

        // Get all characters defined in the key
        const keyChars = new Set<string>(Object.keys(data.key));

        // Verify that all grid characters are defined in the key
        for (const char of gridChars) {
            if (!keyChars.has(char)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["key"],
                    message: `Grid character '${char}' is not defined in the key.`
                });
            }
        }

        // Verify that all key characters are used in the grid
        for (const char of keyChars) {
            if (!gridChars.has(char)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["grid"],
                    message: `Key character '${char}' is not used in the grid.`
                });
            }
        }
    }),
    {
        id: "BingoBoardTemplate",
        type: "other",
        description: "Schema representing a template for generating bingo boards, including its shape, grid layout, and space type definitions.",
        example: BingoBoardTemplateExample
    }
);

export const ZodBingoBoardTemplateSetSchema = registerBingoSchema(
    z.array(ZodBingoBoardTemplateSchema).superRefine((templates, ctx) => {
        const seenIds: string[] = [];
        for (const [index, template] of templates.entries()) {
            if (seenIds.includes(template.id)) {
                ctx.addIssue({
                    code: "custom",
                    message: `No two board templates in this list should have the same id.`,
                    path: [index, "id"]
                });
            } else {
                seenIds.push(template.id);
            }
        }
    }), {
        id: "BingoBoardTemplateSet",
        type: "collection",
        description: "Set of bingo board templates, enforcing ID uniqueness.",
        example: [BingoBoardTemplateExample]
    }
);

export type BingoBoardKeyEntryType = "exact" | "byTag";
export type BingoBoardTemplateInput = z.input<typeof ZodBingoBoardTemplateSchema>;
export type BingoBoardTemplateOutput = z.output<typeof ZodBingoBoardTemplateSchema>;
export type BingoBoardTemplateSet = z.infer<typeof ZodBingoBoardTemplateSetSchema>;