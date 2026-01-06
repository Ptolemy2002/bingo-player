import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";
import { SocketSpaceOpEnum } from "../Other";

export const SocketSpaceOpExample = "mark" as const;

export const ZodSocketSpaceOpSchema = registerSocketSchema(
    z.enum(SocketSpaceOpEnum),
    {
        id: "SpaceOp",
        type: "other",
        description: `A possible operation that can be performed on a space. Options: ${JSON.stringify(SocketSpaceOpEnum)}`,
        example: SocketSpaceOpExample
    }
);

export type SocketSpaceOp = z.infer<typeof ZodSocketSpaceOpSchema>;