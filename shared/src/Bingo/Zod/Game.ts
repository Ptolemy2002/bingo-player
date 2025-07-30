import { z } from "zod";
import { ZodBingoSpaceSetSchema } from "./SpaceSet";
import { ZodBingoPlayerSetSchema } from "./Player";

export const ZodBingoGameSchema = z.object({
    id: z.string().meta({
        description: "Unique identifier for the game"
    }),
    players: ZodBingoPlayerSetSchema.meta({
        description: "Set of players participating in the game"
    }),
    spaces: ZodBingoSpaceSetSchema.meta({
        description: "Set of bingo spaces available in the game"
    })
}).meta({
    id: "BingoGame",
    description: "Schema representing a bingo game with players and spaces"
});

export type BingoGame = z.infer<typeof ZodBingoGameSchema>;