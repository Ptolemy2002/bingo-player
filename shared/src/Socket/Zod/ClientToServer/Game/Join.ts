import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema, ZodBingoPlayerRoleSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameJoinEventName = "gameJoin" as const;

export const ZodSocketGameJoinArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameJoinArgs.id",
                description: "The unique identifier for the game you want to join",
                example: BingoGameExample.id
            }
        ),

        playerName: registerSocketSchema(
            z.string(),
            {
                id: "GameJoinArgs.playerName",
                description: "The name of the player joining the game",
                example: "Player2"
            }
        ),

        playerRole: registerSocketSchema(
            ZodBingoPlayerRoleSchema.exclude(["host"]),
            {
                id: "GameJoinArgs.playerRole",
                description: "The role of the player joining the game. You cannot join as a host, but a host can change your role later.",
                example: "player"
            }
        )
    }),
    {
        id: "GameJoinArgs",
        description: `Arguments schema for the [${SocketGameJoinEventName}] event`,
    }
);

export const ZodSocketGameJoinSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "GameJoinSuccessResponse.game",
                description: "The bingo game you joined",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "GameJoinSuccessResponse",
        description: `Response schema for a successful [${SocketGameJoinEventName}] event`,
    }
);

export const ZodSocketGameJoinResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameJoinSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameJoinResponse",
        description: `Response schema for the [${SocketGameJoinEventName}] event`
    }
);

export type SocketGameJoinArgs = z.infer<typeof ZodSocketGameJoinArgsSchema>;
export type SocketGameJoinSuccessResponse = z.infer<typeof ZodSocketGameJoinSuccessResponseSchema>;
export type SocketGameJoinResponse = z.infer<typeof ZodSocketGameJoinResponseSchema>;
