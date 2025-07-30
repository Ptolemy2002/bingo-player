import { z } from "zod";
import { BingoPlayerRoleEnum } from "../Other";

export const BingoPlayerRoleExample = "host" as const;

export const ZodBingoPlayerRoleSchema = z.enum(BingoPlayerRoleEnum).meta({
    id: "BingoPlayerRole",
    description: "Role of the player in the bingo game",
    example: BingoPlayerRoleExample
});

export type BingoPlayerRole = z.infer<typeof ZodBingoPlayerRoleSchema>;