import { z } from "zod";
import { registerBingoSchema } from "src/Bingo/Registry";
import { BingoPlayerRoleEnum } from "../Other";

export const BingoPlayerRoleExample = "host" as const;

export const ZodBingoPlayerRoleSchema = registerBingoSchema(
    z.enum(BingoPlayerRoleEnum),
    {
        id: "BingoPlayerRole",
        description: "Role of the player in the bingo game",
        example: BingoPlayerRoleExample
    }
);

export type BingoPlayerRole = z.infer<typeof ZodBingoPlayerRoleSchema>;