import z, { GlobalMeta, ZodType } from "zod";

export type SocketMeta = GlobalMeta; 
export const socketSchemas: ZodType[] = [];
export const socketRegistry = z.registry<SocketMeta>();

export function registerSocketSchema(schema: ZodType, meta: SocketMeta = {}): void {
    socketSchemas.push(schema);
    socketRegistry.add(schema, meta);
}