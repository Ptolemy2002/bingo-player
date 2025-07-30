import z, { GlobalMeta, ZodType } from "zod";

export type BingoMeta = GlobalMeta; 
export const bingoSchemas: ZodType[] = [];
export const bingoRegistry = z.registry<BingoMeta>();

export function registerBingoSchema(schema: ZodType, meta: BingoMeta = {}): void {
    bingoSchemas.push(schema);
    bingoRegistry.add(schema, meta);
}