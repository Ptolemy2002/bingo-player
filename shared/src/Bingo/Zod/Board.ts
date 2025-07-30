import { z } from "zod";

export const BingoBoardExample = {
    id: "board123",
    gameId: "game123",
    shape: {
        width: 5,
        height: 5
    },
    spaces: [0, 1, 2, null, 4, 5, 6, 7, 8, 9, null, null, null, null, null]
};

export const ZodBingoBoardSchema = z.object({
    id: z.string().meta({
        description: "Unique identifier for the bingo board",
        example: BingoBoardExample.id
    }),
    gameId: z.string().meta({
        description: "Identifier of the game this board belongs to",
        example: BingoBoardExample.gameId
    }),

    shape: z.object({
        width: z.number().int().positive().meta({
            description: "Width of the bingo board",
            example: BingoBoardExample.shape.width
        }),
        height: z.number().int().positive().meta({
            description: "Height of the bingo board",
            example: BingoBoardExample.shape.height
        })
    }).meta({
        description: "Dimensions of the bingo board, specifying its width and height",
        example: BingoBoardExample.shape
    }),

    spaces: z.array(z.union([
        z.int().positive().meta({
            description: "The index of a space within the game's space set",
            example: BingoBoardExample.spaces[0]
        }),
        z.null().meta({
            description: "Represents an empty space on the board"
        })
    ])).meta({
        description: "Array of spaces on the board. Must be the same length as shape.width * shape.height.",
        example: BingoBoardExample.spaces
    })
}).superRefine((data, ctx) => {
    if (data.spaces.length !== data.shape.width * data.shape.height) {
        ctx.addIssue({
            code: "custom",
            message: "Spaces array length must match shape.width * shape.height",
            path: ["spaces", "length"],
        });
    }
})
.meta({
    id: "BingoBoard",
    description: "Schema representing a bingo board with its dimensions and spaces"
});

export type BingoBoard = z.infer<typeof ZodBingoBoardSchema>;