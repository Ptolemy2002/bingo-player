import { z } from "zod";
import { registerBingoSchema } from "src/Bingo";

export const BingoBoardExample = {
    id: "board123",
    gameId: "game123",
    shape: {
        width: 5,
        height: 5
    },
    spaces: [0, 1, 2, null, 4, 5, 6, 7, 8, 9, null, null, null, null, null]
};

export const ZodBingoBoardSchema = registerBingoSchema(
    z.object({
        id: registerBingoSchema(
            z.string(),
            {
                id: "BingoBoard.id",
                description: "Unique identifier for the bingo board",
                example: BingoBoardExample.id
            }
        ),
        gameId: registerBingoSchema(
            z.string(),
            {
                id: "BingoBoard.gameId",
                description: "Identifier of the game this board belongs to",
                example: BingoBoardExample.gameId
            }
        ),
        shape: registerBingoSchema(
            z.object({
                width: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoard.shape.width",
                        description: "Width of the bingo board",
                        example: BingoBoardExample.shape.width
                    }
                ),
                height: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoard.shape.height",
                        description: "Height of the bingo board",
                        example: BingoBoardExample.shape.height
                    }
                )
            }),
            {
                id: "BingoBoard.shape",
                description: "Dimensions of the bingo board, specifying its width and height",
                example: BingoBoardExample.shape
            }
        ),
        spaces: registerBingoSchema(
            z.array(z.union([
                registerBingoSchema(
                    z.int().positive(),
                    {
                        id: "BingoBoard.spaces.index",
                        description: "The index of a space within the game's space set",
                        example: BingoBoardExample.spaces[0]!
                    }
                ),
                registerBingoSchema(
                    z.null(),
                    {
                        id: "BingoBoard.spaces.null",
                        description: "Represents an empty space on the board"
                    }
                )
            ])),
            {
                id: "BingoBoard.spaces",
                description: "Array of spaces on the board. Must be the same length as shape.width * shape.height.",
                example: BingoBoardExample.spaces
            }
        )
    }).superRefine((data, ctx) => {
        if (data.spaces.length !== data.shape.width * data.shape.height) {
            ctx.addIssue({
                code: "custom",
                message: "Spaces array length must match shape.width * shape.height",
                path: ["spaces", "length"],
            });
        }
    }),
    {
        id: "BingoBoard",
        description: "Schema representing a bingo board with its dimensions and spaces"
    }
);

export type BingoBoard = z.infer<typeof ZodBingoBoardSchema>;