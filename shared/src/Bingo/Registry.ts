import z, { GlobalMeta, ZodType } from "zod";
import { Override } from "@ptolemy2002/ts-utils";

export type BingoMetaSchemaType = "prop" | "collection" | "game-element" | "other";

export type BingoMeta<T extends ZodType = ZodType> =Override<
    GlobalMeta,
    {
        type: BingoMetaSchemaType;
        example?: z.output<T>;
        examples?: z.output<T>[];
    }
>;

export const bingoSchemas: ZodType[] = [];
export const bingoRegistry = z.registry<BingoMeta>();

export function registerBingoSchema<T extends ZodType>(schema: T, meta: BingoMeta<T>): T {
    bingoSchemas.push(schema);
    bingoRegistry.add(schema, meta);
    return schema;
}