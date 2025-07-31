import { z } from "zod";
import { registerBingoSchema } from "src/Bingo/Registry";
import { BingoSpaceSetExample, ZodBingoSpaceSetSchema } from "./SpaceSet";
import { BingoPlayerExamples, ZodBingoPlayerSetSchema } from "./Player";

export const BingoGameExample = {
    id: "game123",
    players: BingoPlayerExamples,
    spaces: BingoSpaceSetExample
};

export const ZodBingoGameSchema = registerBingoSchema(
    z.object({
        id: registerBingoSchema(
            z.string(),
            {
                id: "BingoGame.id",
                description: "Unique identifier for the game",
                example: BingoGameExample.id
            }
        ),
        players: registerBingoSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoPlayerSetSchema`.
            ZodBingoPlayerSetSchema.refine(() => true),
            {
                id: "BingoGame.players",
                description: "Set of players participating in the game",
                example: BingoGameExample.players
            }
        ),
        spaces: registerBingoSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoSpaceSetSchema`.
            ZodBingoSpaceSetSchema.refine(() => true),
            {
                id: "BingoGame.spaces",
                description: "Set of bingo spaces available in the game",
                example: BingoGameExample.spaces
            }
        )
    }),
    {
        id: "BingoGame",
        description: "Schema representing a bingo game with players and spaces",
        example: BingoGameExample
    }
);

export type BingoGame = z.infer<typeof ZodBingoGameSchema>;