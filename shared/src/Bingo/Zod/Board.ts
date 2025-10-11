import { z } from "zod";
import { registerBingoSchema } from "src/Bingo";

export const BingoBoardExample = {
    id: "board123",
    ownerName: "Alice",
    gameId: "game123",
    shape: {
        width: 5,
        height: 5
    },
    spaces: [0, 1, 2, null, 4, 5, 6, 7, 8, 9, null, null, null, null, null, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
};

export const ZodBingoBoardSchema = registerBingoSchema(
    z.object({
        id: registerBingoSchema(
            z.string(),
            {
                id: "BingoBoard.id",
                type: "prop",
                description: "Unique identifier for the bingo board. Must be a string.",
                example: BingoBoardExample.id
            }
        ),
        ownerName: registerBingoSchema(
            z.string().min(1, "Owner name must have at least 1 character"),
            {
                id: "BingoBoard.ownerName",
                type: "prop",
                description: "Name of the player who owns this board. Must be a string with at least 1 character.",
                example: BingoBoardExample.ownerName
            }
        ),
        gameId: registerBingoSchema(
            z.string(),
            {
                id: "BingoBoard.gameId",
                type: "prop",
                description: "Identifier of the game this board belongs to. Must be a string.",
                example: BingoBoardExample.gameId
            }
        ),
        shape: registerBingoSchema(
            z.object({
                width: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoard.shape.width",
                        type: "prop",
                        description: "Width of the bingo board. Must be a positive integer.",
                        example: BingoBoardExample.shape.width
                    }
                ),
                height: registerBingoSchema(
                    z.number().int().positive(),
                    {
                        id: "BingoBoard.shape.height",
                        type: "prop",
                        description: "Height of the bingo board. Must be a positive integer.",
                        example: BingoBoardExample.shape.height
                    }
                )
            }),
            {
                id: "BingoBoard.shape",
                type: "prop",
                description: "Dimensions of the bingo board, specifying its width and height.",
                example: BingoBoardExample.shape
            }
        ),
        spaces: registerBingoSchema(
            z.array(z.union([
                registerBingoSchema(
                    z.int().nonnegative(),
                    {
                        id: "BingoBoard.spaces.item<number>",
                        type: "prop",
                        description: "The index of a space within the game's space set. Must be a non-negative integer.",
                        example: BingoBoardExample.spaces[0]!
                    }
                ),
                registerBingoSchema(
                    z.null(),
                    {
                        id: "BingoBoard.spaces.item<null>",
                        type: "prop",
                        description: "Represents an empty space on the board"
                    }
                )
            ])),
            {
                id: "BingoBoard.spaces",
                type: "prop",
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
        type: "game-element",
        description: "Schema representing a bingo board with its dimensions and spaces",
        example: BingoBoardExample
    }
);

export const ZodBingoBoardSetSchema = registerBingoSchema(
    z.array(ZodBingoBoardSchema).superRefine((boards, ctx) => {
        const seenIds: string[] = [];
        for (const [index, board] of boards.entries()) {
            if (seenIds.includes(board.id)) {
                ctx.addIssue({
                    code: "custom",
                    message: `No two boards in this list should have the same ID.`,
                    path: ["id"],
                    params: {
                        duplicateId: board.id,
                        boardIndex: index
                    }
                });
            } else {
                seenIds.push(board.id);
            }
        }
    }),
    {
        id: "BingoBoardSet",
        type: "collection",
        description: "Set of bingo boards, enforcing unique IDs",
        example: [BingoBoardExample]
    }
);

export type BingoBoard = z.infer<typeof ZodBingoBoardSchema>;
export type BingoBoardSet = z.infer<typeof ZodBingoBoardSetSchema>;