import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const ZodGameStateArgsSchema = registerSocketSchema(
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
        description: "Arguments schema for the GameState request"
    }
);

export const ZodGameStateSuccessResponseSchema = registerSocketSchema(
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
        description: "Response schema for a successful GameState request"
    }
);

export const ZodGameStateResponseSchema = registerSocketSchema(
    z.union([
        ZodGameStateSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameStateResponse",
        description: "Response schema for the GameState request"
    }
);

export type GameStateArgs = z.infer<typeof ZodGameStateArgsSchema>;
export type GameStateSuccessResponse = z.infer<typeof ZodGameStateSuccessResponseSchema>;
export type GameStateResponse = z.infer<typeof ZodGameStateResponseSchema>;