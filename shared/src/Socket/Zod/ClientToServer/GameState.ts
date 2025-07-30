import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { z } from "zod";

export const ZodGameStateArgsSchema = z.object({
    id: z.string().meta({
        description: "The unique identifier for the game you want to retrieve the state for",
        example: BingoGameExample.id
    })
}).meta({
    id: "GameStateArgs",
    description: "Arguments schema for the GameState request"
});

export const ZodGameStateSuccessResponseSchema = zodSuccessResponseSchema(z.object({
    game: ZodBingoGameSchema.meta({
        description: "The current state of the bingo game",
        example: BingoGameExample
    })
})).meta({
    id: "GameStateSuccessResponse",
    description: "Response schema for a successful GameState request"
});

export const ZodGameStateResponseSchema = z.union([
    ZodGameStateSuccessResponseSchema,
    ZodErrorResponseSchema,
]).meta({
    id: "GameStateResponse",
    description: "Response schema for the GameState request"
});

export type GameStateArgs = z.infer<typeof ZodGameStateArgsSchema>;
export type GameStateSuccessResponse = z.infer<typeof ZodGameStateSuccessResponseSchema>;
export type GameStateResponse = z.infer<typeof ZodGameStateResponseSchema>;