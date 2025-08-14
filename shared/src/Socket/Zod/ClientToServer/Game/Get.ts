import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameGetEventName = "gameGet" as const;

export const ZodSocketGameGetArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameGetArgs.id",
                type: "prop",
                description: "The unique identifier for the game you want to retrieve the state for. Must be a string.",
                example: BingoGameExample.id
            }
        )
    }),
    {
        id: "GameGetArgs",
        type: "args",
        eventName: SocketGameGetEventName,
        description: `Arguments schema for the [${SocketGameGetEventName}] event`,
    }
);

export const ZodSocketGameGetSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "GameGetSuccessResponse.game",
                type: "prop",
                description: "The current state of the bingo game",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "GameGetSuccessResponse",
        type: "success-response",
        eventName: SocketGameGetEventName,
        description: `Response schema for a successful [${SocketGameGetEventName}] event`
    }
);

export const ZodSocketGameGetResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameGetSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameGetResponse",
        type: "response",
        eventName: SocketGameGetEventName,
        description: `Response schema for the [${SocketGameGetEventName}] event`
    }
);

export type SocketGameGetArgs = z.infer<typeof ZodSocketGameGetArgsSchema>;
export type SocketGameGetSuccessResponse = z.infer<typeof ZodSocketGameGetSuccessResponseSchema>;
export type SocketGameGetResponse = z.infer<typeof ZodSocketGameGetResponseSchema>;