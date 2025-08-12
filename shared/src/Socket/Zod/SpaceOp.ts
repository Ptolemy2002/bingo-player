import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";
import { SocketSpaceOpEnum } from "../Other";

export const SocketSpaceOpExample = "mark" as const;

export const ZodSocketSpaceOpSchema = registerSocketSchema(
    z.enum(SocketSpaceOpEnum),
    {
        id: "SpaceOp",
        type: "other",
        description: "A possible operation that can be performed on a space",
        example: SocketSpaceOpExample
    }
);

export type SocketSpaceOp = z.infer<typeof ZodSocketSpaceOpSchema>;