import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, BingoPlayerRoleEnum, ZodBingoGameSchema, ZodBingoPlayerRoleSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameJoinEventName = "gameJoin" as const;

export const ZodSocketGameJoinArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameJoinArgs.id",
                type: "prop",
                description: "The unique identifier for the game you want to join. Must be a string.",
                example: BingoGameExample.id
            }
        ),

        playerName: registerSocketSchema(
            z.string(),
            {
                id: "GameJoinArgs.playerName",
                type: "prop",
                description: "The name of the player joining the game. Must be a string.",
                example: "Player2"
            }
        ),

        playerRole: registerSocketSchema(
            ZodBingoPlayerRoleSchema.exclude(["host"]),
            {
                id: "GameJoinArgs.playerRole",
                type: "prop",
                description: 
                    `The role of the player joining the game. You cannot join as a host, but a host can change your role later. ` +
                    `Options: ${JSON.stringify(BingoPlayerRoleEnum.filter(r => r !== "host"))}`,
                example: "player"
            }
        )
    }),
    {
        id: "GameJoinArgs",
        type: "args",
        eventName: SocketGameJoinEventName,
        description: `Add a player with the specified name and role to the game with the specified ID. The player will be associated with your socket ID.`
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
                type: "prop",
                description: "The bingo game you joined",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "GameJoinSuccessResponse",
        type: "success-response",
        eventName: SocketGameJoinEventName,
        description: `The bingo game you joined`
    }
);

export const ZodSocketGameJoinResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameJoinSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameJoinResponse",
        type: "response",
        eventName: SocketGameJoinEventName,
        description: `Response schema for the [${SocketGameJoinEventName}] event`
    }
);

export type SocketGameJoinArgs = z.infer<typeof ZodSocketGameJoinArgsSchema>;
export type SocketGameJoinSuccessResponse = z.infer<typeof ZodSocketGameJoinSuccessResponseSchema>;
export type SocketGameJoinResponse = z.infer<typeof ZodSocketGameJoinResponseSchema>;
