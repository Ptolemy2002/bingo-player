import { BingoBoardTemplateExample, ZodBingoBoardTemplateSchema } from "src/Bingo";
import { SocketBoardTemplateChangeTypeEnum } from "src/Socket/Other";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketBoardTemplatesChangeEventName = "boardTemplatesChange" as const;

export const SocketBoardTemplatesChangeDataExample = {
    type: "add",
    gameId: "game-123",
    boardTemplates: [BingoBoardTemplateExample]
} as const;

export const ZodSocketBoardTemplatesChangeTypeSchema = registerSocketSchema(
    z.enum(SocketBoardTemplateChangeTypeEnum),
    {
        id: "BoardTemplatesChangeType",
        type: "prop",
        description: `The operation that was performed on the board templates. Options: ${JSON.stringify(SocketBoardTemplateChangeTypeEnum)}`,
        example: SocketBoardTemplatesChangeDataExample.type
    }
);

export const ZodSocketBoardTemplatesChangeDataSchema = registerSocketSchema(
    z.object({
        type: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodSocketBoardTemplatesChangeTypeSchema`.
            ZodSocketBoardTemplatesChangeTypeSchema.refine(() => true),
            {
                id: "BoardTemplatesChangeData.type",
                type: "prop",
                description: `The operation that was performed on the board templates. Options: ${JSON.stringify(SocketBoardTemplateChangeTypeEnum)}`,
                example: SocketBoardTemplatesChangeDataExample.type
            }
        ),
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "BoardTemplatesChangeData.gameId",
                type: "prop",
                description: "The unique identifier for the game where the board templates were changed. Must be a string.",
                example: SocketBoardTemplatesChangeDataExample.gameId
            }
        ),
        boardTemplates: registerSocketSchema(
            z.array(
                // This `refine` pattern allows us to copy the schema so that the original metadata
                // is not overwritten on `ZodBingoBoardTemplateSchema`.
                ZodBingoBoardTemplateSchema.refine(() => true)
            ),
            {
                id: "BoardTemplatesChangeData.boardTemplates",
                type: "prop",
                description: "The board templates that were changed. Must be an array of BingoBoardTemplate objects.",
                example: SocketBoardTemplatesChangeDataExample.boardTemplates as any // Doing this to bypass the readonly issue
            }
        )
    }),
    {
        id: "BoardTemplatesChangeData",
        type: "message-data",
        description: "Data for the 'boardTemplatesChange' ServerToClient event, which notifies clients about changes to the board templates in a game.",
        example: SocketBoardTemplatesChangeDataExample as any // Doing this to bypass the readonly issue+
    }
);

export type SocketBoardTemplatesChangeType = z.infer<typeof ZodSocketBoardTemplatesChangeTypeSchema>;
export type SocketBoardTemplatesChangeData = z.infer<typeof ZodSocketBoardTemplatesChangeDataSchema>;
