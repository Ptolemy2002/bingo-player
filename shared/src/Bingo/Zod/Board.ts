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

const BingoBoardIdSchema = z.string();
registerBingoSchema(BingoBoardIdSchema, {
    id: "BingoBoard.id",
    description: "Unique identifier for the bingo board",
    example: BingoBoardExample.id
});

const BingoBoardGameIdSchema = z.string();
registerBingoSchema(BingoBoardGameIdSchema, {
    id: "BingoBoard.gameId",
    description: "Identifier of the game this board belongs to",
    example: BingoBoardExample.gameId
});

const BingoBoardShapeWidthSchema = z.number().int().positive();
registerBingoSchema(BingoBoardShapeWidthSchema, {
    id: "BingoBoard.shape.width",
    description: "Width of the bingo board",
    example: BingoBoardExample.shape.width
});

const BingoBoardShapeHeightSchema = z.number().int().positive();
registerBingoSchema(BingoBoardShapeHeightSchema, {
    id: "BingoBoard.shape.height",
    description: "Height of the bingo board",
    example: BingoBoardExample.shape.height
});

const BingoBoardShapeSchema = z.object({
    width: BingoBoardShapeWidthSchema,
    height: BingoBoardShapeHeightSchema
});
registerBingoSchema(BingoBoardShapeSchema, {
    id: "BingoBoard.shape",
    description: "Dimensions of the bingo board, specifying its width and height",
    example: BingoBoardExample.shape
});

const BingoBoardSpaceIndexSchema = z.int().positive();
registerBingoSchema(BingoBoardSpaceIndexSchema, {
    id: "BingoBoard.spaces.index",
    description: "The index of a space within the game's space set",
    example: BingoBoardExample.spaces[0]
});

const BingoBoardSpaceNullSchema = z.null();
registerBingoSchema(BingoBoardSpaceNullSchema, {
    id: "BingoBoard.spaces.null",
    description: "Represents an empty space on the board"
});

const BingoBoardSpacesSchema = z.array(z.union([
    BingoBoardSpaceIndexSchema,
    BingoBoardSpaceNullSchema
]));
registerBingoSchema(BingoBoardSpacesSchema, {
    id: "BingoBoard.spaces",
    description: "Array of spaces on the board. Must be the same length as shape.width * shape.height.",
    example: BingoBoardExample.spaces
});

export const ZodBingoBoardSchema = z.object({
    id: BingoBoardIdSchema,
    gameId: BingoBoardGameIdSchema,
    shape: BingoBoardShapeSchema,
    spaces: BingoBoardSpacesSchema
}).superRefine((data, ctx) => {
    if (data.spaces.length !== data.shape.width * data.shape.height) {
        ctx.addIssue({
            code: "custom",
            message: "Spaces array length must match shape.width * shape.height",
            path: ["spaces", "length"],
        });
    }
});

registerBingoSchema(ZodBingoBoardSchema, {
    id: "BingoBoard",
    description: "Schema representing a bingo board with its dimensions and spaces"
});

export type BingoBoard = z.infer<typeof ZodBingoBoardSchema>;