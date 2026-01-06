import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";
import { SocketBoardOpEnum } from "../Other";

export const SocketBoardOpExample = "add" as const;

export const ZodSocketBoardOpSchema = registerSocketSchema(
    z.enum(SocketBoardOpEnum),
    {
        id: "BoardOp",
        type: "other",
        description: `A possible operation that can be performed on a board. Options: ${JSON.stringify(SocketBoardOpEnum)}`,
        example: SocketBoardOpExample
    }
);

export type SocketBoardOp = z.infer<typeof ZodSocketBoardOpSchema>;