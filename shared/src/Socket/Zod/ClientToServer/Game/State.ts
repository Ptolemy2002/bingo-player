import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameStateEventName = "gameState" as const;

export const ZodSocketGameStateArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameStateArgs.id",
                description: "The unique identifier for the game you want to retrieve the state for",
                example: BingoGameExample.id
            }
        )
    }),
    {
        id: "GameStateArgs",
        description: `Arguments schema for the [${SocketGameStateEventName}] event`,
    }
);

export const ZodSocketGameStateSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "GameStateSuccessResponse.game",
                description: "The current state of the bingo game",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "GameStateSuccessResponse",
        description: `Response schema for a successful [${SocketGameStateEventName}] event`
    }
);

export const ZodSocketGameStateResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameStateSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameStateResponse",
        description: `Response schema for the [${SocketGameStateEventName}] event`
    }
);

export type SocketGameStateArgs = z.infer<typeof ZodSocketGameStateArgsSchema>;
export type SocketGameStateSuccessResponse = z.infer<typeof ZodSocketGameStateSuccessResponseSchema>;
export type SocketGameStateResponse = z.infer<typeof ZodSocketGameStateResponseSchema>;