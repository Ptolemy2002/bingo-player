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
export const stringboolEnum: (string | boolean)[] = [true, ...stringboolParams.truthy!, false, ...stringboolParams.falsy!];
export const stringboolSchema = z.union([z.boolean(), z.stringbool(stringboolParams)]);