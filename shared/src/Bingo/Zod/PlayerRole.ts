import { z } from "zod";
import { BingoPlayerRoleEnum } from "../Other";

export const ZodBingoPlayerRoleSchema = z.enum(BingoPlayerRoleEnum).meta({
    id: "BingoPlayerRole",
    description: "Role of the player in the bingo game"
});

export type BingoPlayerRole = z.infer<typeof ZodBingoPlayerRoleSchema>;