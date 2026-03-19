import { z } from "zod";
import { registerBingoSchema } from "src/Bingo/Registry";
import { BingoSpaceSetExample, ZodBingoSpaceSetSchema } from "./SpaceSet";
import { BingoPlayerExamples, ZodBingoPlayerSetSchema } from "./Player";
import { BingoBoardExample, ZodBingoBoardSetSchema } from "./Board";
import { BingoBoardTemplateExample, ZodBingoBoardTemplateSetSchema } from "./BoardTemplate";

export const BingoGameExample = {
    id: "game123",
    players: BingoPlayerExamples,
    spaces: BingoSpaceSetExample,
    boards: [BingoBoardExample],
    boardTemplates: [BingoBoardTemplateExample]
};

export const ZodBingoGameSchema = registerBingoSchema(
    z.object({
        id: registerBingoSchema(
            z.string(),
            {
                id: "BingoGame.id",
                type: "prop",
                description: "Unique identifier for the game. Must be a string.",
                example: BingoGameExample.id
            }
        ),
        players: registerBingoSchema(
            ZodBingoPlayerSetSchema,
            {
                id: "BingoGame.players",
                type: "prop",
                description: "Set of players participating in the game, enforcing name uniqueness.",
                example: BingoGameExample.players
            }
        ),
        spaces: registerBingoSchema(
            ZodBingoSpaceSetSchema,
            {
                id: "BingoGame.spaces",
                type: "prop",
                description: "Set of bingo spaces available in the game, enforcing ID uniqueness.",
                example: BingoGameExample.spaces
            }
        ),
        boards: registerBingoSchema(
            ZodBingoBoardSetSchema,
            {
                id: "BingoGame.boards",
                type: "prop",
                description: "Set of bingo boards in the game, enforcing ID uniqueness.",
                example: BingoGameExample.boards
            }
        ),
        boardTemplates: registerBingoSchema(
            ZodBingoBoardTemplateSetSchema,
            {
                id: "BingoGame.boardTemplates",
                type: "prop",
                description: "Set of bingo board templates available in the game, enforcing ID uniqueness.",
                example: BingoGameExample.boardTemplates
            }
        )
    }),
    {
        id: "BingoGame",
        type: "game-element",
        description: "Schema representing a bingo game with players and spaces",
        example: BingoGameExample
    }
);

export type BingoGame = z.infer<typeof ZodBingoGameSchema>;