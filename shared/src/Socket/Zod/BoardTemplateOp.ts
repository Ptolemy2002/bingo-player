import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";
import { SocketBoardTemplateOpEnum } from "../Other";

export const SocketBoardTemplateOpExample = "add" as const;

export const ZodSocketBoardTemplateOpSchema = registerSocketSchema(
    z.enum(SocketBoardTemplateOpEnum),
    {
        id: "BoardTemplateOp",
        type: "other",
        description: `A possible operation that can be performed on a board template. Options: ${JSON.stringify(SocketBoardTemplateOpEnum)}`,
        example: SocketBoardTemplateOpExample
    }
);

export type SocketBoardTemplateOp = z.infer<typeof ZodSocketBoardTemplateOpSchema>;