import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema, ZodBingoPlayerRoleSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameLeaveEventName = "gameLeave" as const;

export const ZodSocketGameLeaveArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameLeaveArgs.id",
                type: "prop",
                description: "The unique identifier for the game you want to leave. Must be a string.",
                example: BingoGameExample.id
            }
        ),
        playerName: registerSocketSchema(
            z.string(),
            {
                id: "GameLeaveArgs.playerName",
                type: "prop",
                description: "The name of the player leaving the game. Must be a string.",
                example: "Player2"
            }
        )
    }),
    {
        id: "GameLeaveArgs",
        type: "args",
        eventName: SocketGameLeaveEventName,
        description: `Leave the game with the specified ID. Doubles as a kick action for hosts.`,
        example: {
            id: BingoGameExample.id,
            playerName: "Player2"
        }
    }
);

export const ZodSocketGameLeaveSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({})),
    {
        id: "GameLeaveSuccessResponse",
        type: "success-response",
        eventName: SocketGameLeaveEventName,
        description: "Successful response for the gameLeave event.",
        example: {
            ok: true,
            help: "http://bingo.api/docs#event-gameLeave"
        }
    }
);

export const ZodSocketGameLeaveResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameLeaveSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameLeaveResponse",
        type: "response",
        eventName: SocketGameLeaveEventName,
        description: `Response schema for the [${SocketGameLeaveEventName}] event`,
        example: {
            ok: false,
            code: "UNKNOWN",
            message: "An unknown error occurred.",
            help: "http://bingo.api/docs#event-gameLeave",
        }
    }
);

export type SocketGameLeaveArgs = z.infer<typeof ZodSocketGameLeaveArgsSchema>;
export type SocketGameLeaveResponse = z.infer<typeof ZodSocketGameLeaveResponseSchema>;
export type SocketGameLeaveSuccessResponse = z.infer<typeof ZodSocketGameLeaveSuccessResponseSchema>;