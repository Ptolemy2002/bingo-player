import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

const GameStateArgsIdSchema = z.string();
registerSocketSchema(GameStateArgsIdSchema, {
    id: "GameStateArgs.id",
    description: "The unique identifier for the game you want to retrieve the state for",
    example: BingoGameExample.id
});

export const ZodGameStateArgsSchema = z.object({
    id: GameStateArgsIdSchema
});

registerSocketSchema(ZodGameStateArgsSchema, {
    id: "GameStateArgs",
    description: "Arguments schema for the GameState request"
});

const GameStateSuccessResponseGameSchema = ZodBingoGameSchema;
registerSocketSchema(GameStateSuccessResponseGameSchema, {
    id: "GameStateSuccessResponse.game",
    description: "The current state of the bingo game",
    example: BingoGameExample
});

export const ZodGameStateSuccessResponseSchema = zodSuccessResponseSchema(z.object({
    game: GameStateSuccessResponseGameSchema
}));

registerSocketSchema(ZodGameStateSuccessResponseSchema, {
    id: "GameStateSuccessResponse",
    description: "Response schema for a successful GameState request"
});

export const ZodGameStateResponseSchema = z.union([
    ZodGameStateSuccessResponseSchema,
    ZodErrorResponseSchema,
]);

registerSocketSchema(ZodGameStateResponseSchema, {
    id: "GameStateResponse",
    description: "Response schema for the GameState request"
});

export type GameStateArgs = z.infer<typeof ZodGameStateArgsSchema>;
export type GameStateSuccessResponse = z.infer<typeof ZodGameStateSuccessResponseSchema>;
export type GameStateResponse = z.infer<typeof ZodGameStateResponseSchema>;