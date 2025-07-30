import { z } from "zod";
import { BingoSpaceSetExample, ZodBingoSpaceSetSchema } from "./SpaceSet";
import { BingoPlayerExamples, ZodBingoPlayerSetSchema } from "./Player";

export const BingoGameExample = {
    id: "game123",
    players: BingoPlayerExamples,
    spaces: BingoSpaceSetExample
};

export const ZodBingoGameSchema = z.object({
    id: z.string().meta({
        description: "Unique identifier for the game",
        example: BingoGameExample.id
    }),
    players: ZodBingoPlayerSetSchema.meta({
        description: "Set of players participating in the game",
        example: BingoGameExample.players
    }),
    spaces: ZodBingoSpaceSetSchema.meta({
        description: "Set of bingo spaces available in the game",
        example: BingoGameExample.spaces
    })
}).meta({
    id: "BingoGame",
    description: "Schema representing a bingo game with players and spaces",
    example: BingoGameExample
});

export type BingoGame = z.infer<typeof ZodBingoGameSchema>;