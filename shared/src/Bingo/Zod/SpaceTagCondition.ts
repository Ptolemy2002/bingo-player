import { createSerializableAdvancedCondition, SerializableAdvancedCondition, SerializableValueCondition, ValueCondition } from "@ptolemy2002/ts-utils";
import z from "zod";
import { registerBingoSchema } from "../Registry";

export const BingoSpaceTagConditionExample = [
    "tag-1", "tag-2", {
        include: ["tag-3"],
        exclude: ["tag-4"]
    } as SerializableAdvancedCondition<string> // So that we don't have to do the full advanced condition construction here
];

const AdvancedConditionSchema = z.object({
    include: z.union([
        z.string(),
        z.array(z.union([z.string(), z.literal(false)]))
    ]),
    exclude: z.union([
        z.string(),
        z.array(z.union([z.string(), z.literal(false)]))
    ])
}).partial()
    // Adding the necessary fields and branding to make it a SerializableAdvancedCondition<string>
    .transform((data) => createSerializableAdvancedCondition<string>(data))
;

// Attempt to imitate `SerializableValueCondition<string>` but not supporting recursive arrays
// because Zod does not support recursive schemas directly, and recursion is only there for convenience
// (the same effect can be achieved by spreading arrays manually)
export const ZodBingoSpaceTagConditionSchema = registerBingoSchema(
    z.union([
        z.string(),
        AdvancedConditionSchema,
        z.array(z.union([
            z.string(),
            AdvancedConditionSchema,
            z.literal(false)
        ]))
    ]),
    {
        id: "BingoSpaceTagCondition",
        type: "other",
        description: "Condition to match bingo space tags. Can be a string, an advanced condition object, or an array of strings and/or advanced condition objects.",
        example: BingoSpaceTagConditionExample as any // Doing an assertion here because of some issues with branding.
    }
);

export type BingoSpaceTagCondition = z.input<typeof ZodBingoSpaceTagConditionSchema>;