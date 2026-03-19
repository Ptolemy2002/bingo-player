import z, { GlobalMeta, ZodType } from "zod";
import { zodClone } from "@ptolemy2002/zod-utils";
import { Override } from "@ptolemy2002/ts-utils";

export type BingoMetaSchemaType = "prop" | "collection" | "game-element" | "other";

export type BingoMeta<T extends ZodType = ZodType> = Override<
    GlobalMeta,
    {
        id: string;
        description: string;
        type: BingoMetaSchemaType;
        example?: z.input<T>;
        examples?: z.input<T>[];
    }
>;

export const BingoSchemas: ZodType[] = [];
export const bingoRegistry = z.registry<BingoMeta>();

export function registerBingoSchema<T extends ZodType>(schema: T, meta: BingoMeta<T>): T {
    const clonedSchema = zodClone(schema);
    BingoSchemas.push(clonedSchema);
    bingoRegistry.add(clonedSchema, meta);
    return clonedSchema;
}