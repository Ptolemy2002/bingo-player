import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketSpaceMarkAllEventName = "spaceMarkAll" as const;

export const ZodSocketSpaceMarkAllArgsSchema = registerSocketSchema(
    z.object({
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "SpaceMarkAllArgs.gameId",
                description: "The unique identifier for the game you want to mark a space in",
                example: BingoGameExample.id
            }
        ),
        index: registerSocketSchema(
            z.number().int().min(0, {
                error: "Space index must be a non-negative integer, as the game's space set is zero-indexed."
            }),
            {
                id: "SpaceMarkAllArgs.index",
                description: "The index of the space to mark in the bingo game",
                example: 0
            }
        )
    }),
    {
        id: "SpaceMarkAllArgs",
        description: `Arguments schema for the [${SocketSpaceMarkAllEventName}] event`,
    }
);

export const ZodSocketSpaceMarkAllSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        numBoardsMarked: registerSocketSchema(
            z.number().min(0, {
                error: "Number of boards marked must be a non-negative integer."
            })
        )
    })),
    {
        id: "SpaceMarkAllSuccessResponse",
        description: `Response schema for a successful [${SocketSpaceMarkAllEventName}] event`
    }
);

export const ZodSocketSpaceMarkAllResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketSpaceMarkAllSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "SpaceMarkAllResponse",
        description: `Response schema for the [${SocketSpaceMarkAllEventName}] event`
    }
);

export type SocketSpaceMarkAllArgs = z.infer<typeof ZodSocketSpaceMarkAllArgsSchema>;
export type SocketSpaceMarkAllSuccessResponse = z.infer<typeof ZodSocketSpaceMarkAllSuccessResponseSchema>;
export type SocketSpaceMarkAllResponse = z.infer<typeof ZodSocketSpaceMarkAllResponseSchema>;