import { Override } from "@ptolemy2002/ts-utils";
import z, { GlobalMeta, ZodType } from "zod";

export type SocketMetaSchemaType = "args" | "prop" | "response" | "success-response" | "other";

export type SocketMeta<T extends ZodType = ZodType> = Override<
    GlobalMeta,
    {
        id: string;
        description: string;
        type: SocketMetaSchemaType;
        eventName?: string;
        example?: z.input<T>;
        examples?: z.input<T>[];
    }
>;

export const SocketSchemas: ZodType[] = [];
export const socketRegistry = z.registry<SocketMeta>();

export function registerSocketSchema<T extends ZodType>(schema: T, meta: SocketMeta<T>): T {
    SocketSchemas.push(schema);
    socketRegistry.add(schema, meta);
    return schema;
}