import { z } from "zod";
import { registerBingoSchema } from "src/Bingo/Registry";
import { BingoSpaceSetExample, ZodBingoSpaceSetSchema } from "./SpaceSet";
import { BingoPlayerExamples, ZodBingoPlayerSetSchema } from "./Player";

export const BingoGameExample = {
    id: "game123",
    players: BingoPlayerExamples,
    spaces: BingoSpaceSetExample
};

const BingoGameIdSchema = z.string();
registerBingoSchema(BingoGameIdSchema, {
    id: "BingoGame.id",
    description: "Unique identifier for the game",
    example: BingoGameExample.id
});

const BingoGamePlayersSchema = ZodBingoPlayerSetSchema;
registerBingoSchema(BingoGamePlayersSchema, {
    id: "BingoGame.players",
    description: "Set of players participating in the game",
    example: BingoGameExample.players
});

const BingoGameSpacesSchema = ZodBingoSpaceSetSchema;
registerBingoSchema(BingoGameSpacesSchema, {
    id: "BingoGame.spaces",
    description: "Set of bingo spaces available in the game",
    example: BingoGameExample.spaces
});

export const ZodBingoGameSchema = z.object({
    id: BingoGameIdSchema,
    players: BingoGamePlayersSchema,
    spaces: BingoGameSpacesSchema
});

registerBingoSchema(ZodBingoGameSchema, {
    id: "BingoGame",
    description: "Schema representing a bingo game with players and spaces",
    example: BingoGameExample
});

export type BingoGame = z.infer<typeof ZodBingoGameSchema>;