import { z } from "zod";

export const ZodBingoBoardSchema = z.object({
    id: z.string().meta({
        description: "Unique identifier for the bingo board"
    }),
    gameId: z.string().meta({
        description: "Identifier of the game this board belongs to"
    }),

    shape: z.object({
        width: z.number().int().positive().meta({
            description: "Width of the bingo board"
        }),
        height: z.number().int().positive().meta({
            description: "Height of the bingo board"
        })
    }).meta({
        description: "Dimensions of the bingo board, specifying its width and height"
    }),

    spaces: z.array(z.union([
        z.int().positive().meta({
            description: "The index of a space within the game's space set"
        }),
        z.null().meta({
            description: "Represents an empty space on the board"
        })
    ])).meta({
        description: "Array of spaces on the board. Must be the same length as shape.width * shape.height."
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