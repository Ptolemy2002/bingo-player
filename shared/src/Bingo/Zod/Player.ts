import { z } from "zod";
import { registerBingoSchema } from "src/Bingo/Registry";
import { ZodBingoPlayerRoleSchema } from "./PlayerRole";
import { ZodSocketIDSchema } from "src/Socket";
import { BingoPlayerRoleEnum } from "../Other";

export const BingoPlayerExamples = [
    {
        name: "Alice",
        role: "host" as const,
        socketId: "socket123"
    },
    {
        name: "Bob",
        role: "player" as const,
        socketId: "socket456"
    }
];

export const ZodBingoPlayerSchema = registerBingoSchema(
    z.object({
        name: registerBingoSchema(
            z.string().min(1, "Name must have at least 1 character"),
            {
                id: "BingoPlayer.name",
                type: "prop",
                description: "Name of the player. Must be a string with at least 1 character.",
                example: BingoPlayerExamples[0].name
            }
        ),
        role: registerBingoSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoPlayerRoleSchema`.
            ZodBingoPlayerRoleSchema.refine(() => true),
            {
                id: "BingoPlayer.role",
                type: "prop",
                description: `Role of the player. Options: ${JSON.stringify(BingoPlayerRoleEnum)}`,
                example: BingoPlayerExamples[0].role
            }
        ),
        socketId: registerBingoSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodSocketIDSchema`.
            ZodSocketIDSchema.refine(() => true),
            {
                id: "BingoPlayer.socketId",
                type: "prop",
                description: "Socket ID of the player. Must be a string exactly 20 characters long",
                example: BingoPlayerExamples[0].socketId
            }
        )
    }),
    {
        id: "BingoPlayer",
        type: "game-element",
        description: "Schema representing a bingo player",
        example: BingoPlayerExamples[0]
    }
);

export const ZodBingoPlayerSetSchema = registerBingoSchema(
    z.array(ZodBingoPlayerSchema).superRefine((players, ctx) => {
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
    }),
    {
        id: "BingoPlayerSet",
        type: "collection",
        description: "Set of Bingo players, enforcing unique names",
        example: BingoPlayerExamples
    }
);

export type BingoPlayer = z.infer<typeof ZodBingoPlayerSchema>;
export type BingoPlayerSet = z.infer<typeof ZodBingoPlayerSetSchema>;