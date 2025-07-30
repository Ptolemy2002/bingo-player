import { z } from "zod";
import { ZodBingoPlayerRoleSchema } from "./PlayerRole";
import { ZodSocketIDSchema } from "src/Socket";

export const BingoPlayerExamples = [
    {
        name: "Alice",
        role: "host",
        socketId: "socket123"
    },
    {
        name: "Bob",
        role: "player",
        socketId: "socket456"
    }
] as const;

export const ZodBingoPlayerSchema = z.object({
    name: z.string().min(1, "Name must have at least 1 character"),
    role: ZodBingoPlayerRoleSchema,
    socketId: ZodSocketIDSchema
});

export const ZodBingoPlayerSetSchema = z.array(ZodBingoPlayerSchema).superRefine((players, ctx) => {
    const seenNames: string[] = [];
    for (const [index, player] of players.entries()) {
        if (seenNames.includes(player.name)) {
            ctx.addIssue({
                code: "custom",
                message: `No two players in this list should have the same name.`,
                path: ["players", index, "name"]
            });
        } else {
            seenNames.push(player.name);
        }
    }
}).meta({
    id: "BingoPlayerSet",
    description: "Set of Bingo players, ensuring unique names",
    examples: BingoPlayerExamples
});

export type BingoPlayer = z.infer<typeof ZodBingoPlayerSchema>;
export type BingoPlayerSet = z.infer<typeof ZodBingoPlayerSetSchema>;