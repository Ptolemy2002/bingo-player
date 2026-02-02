import { BingoBoardExample, ZodBingoBoardSchema } from "src/Bingo";
import { SocketBoardsChangeTypeEnum } from "src/Socket/Other";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketBoardsChangeEventName = "boardsChange" as const;

export const SocketBoardsChangeDataExample = {
    type: "add",
    gameId: BingoBoardExample.gameId,
    boards: [BingoBoardExample]
} as const;

export const ZodSocketBoardsChangeTypeSchema = registerSocketSchema(
    z.enum(SocketBoardsChangeTypeEnum),
    {
        id: "BoardsChangeType",
        type: "other",
        description: `The operation that was performed on the boards. Options: ${JSON.stringify(SocketBoardsChangeTypeEnum)}`,
        example: SocketBoardsChangeDataExample.type
    }
);

export const ZodSocketBoardsChangeDataSchema = registerSocketSchema(
    z.object({
        type: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodSocketBoardsChangeTypeSchema`.
            ZodSocketBoardsChangeTypeSchema.refine(() => true),
            {
                id: "BoardsChangeData.type",
                type: "prop",
                description: `The operation that was performed on the boards. Options: ${JSON.stringify(SocketBoardsChangeTypeEnum)}`,
                example: SocketBoardsChangeDataExample.type
            }
        ),
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "BoardsChangeData.gameId",
                type: "prop",
                description: "The unique identifier for the game where the boards were changed. Must be a string.",
                example: SocketBoardsChangeDataExample.gameId
            }
        ),
        boards: registerSocketSchema(
            z.array(
                // This `refine` pattern allows us to copy the schema so that the original metadata
                // is not overwritten on `ZodBingoBoardSchema`.
                ZodBingoBoardSchema.refine(() => true)
            ),
            {
                id: "BoardsChangeData.boards",
                type: "prop",
                description: "The boards that were changed. Must be an array of BingoBoard objects.",
                example: SocketBoardsChangeDataExample.boards as any // Doing this to bypass the readonly issue
            }
        )
    }),
    {
        id: "BoardsChangeData",
        type: "message-data",
        eventName: SocketBoardsChangeEventName,
        description: "Data for the 'boardsChange' ServerToClient event, which notifies clients about changes to the boards in a game.",
        example: SocketBoardsChangeDataExample as any, // Doing this to bypass the readonly issue
    }
);

export type SocketBoardsChangeType = z.infer<typeof ZodSocketBoardsChangeTypeSchema>;
export type SocketBoardsChangeData = z.infer<typeof ZodSocketBoardsChangeDataSchema>;