import { z } from "zod";

export const stringboolParams: z.core.$ZodStringBoolParams = {
    truthy: [
        "true",
        "t",
        "yes",
        "on",
        "y",
        "1"
    ],

    falsy: [
        "false",
        "f",
        "no",
        "off",
        "n",
        "0"
    ]
};
export const stringboolEnum: (string | boolean)[] = [true, ...stringboolParams.truthy!, false, ...stringboolParams.falsy!]
    // Filtering these out since the OpenApi interface shows both boolean and string options, so having "true" and "false" in the enum is redundant
    // and clutters the interface. The stringbool schema will still accept "true" and "false" as valid inputs, so this does not affect functionality.
    .filter(v => v !== "true" && v !== "false")
;
export const stringboolSchema = z.union([z.boolean(), z.stringbool(stringboolParams)]);