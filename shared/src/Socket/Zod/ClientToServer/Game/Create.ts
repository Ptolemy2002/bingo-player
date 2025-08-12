import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameCreateEventName = "gameCreate" as const;

export const ZodSocketGameCreateArgsSchema = registerSocketSchema(
    z.object({
        id: registerSocketSchema(
            z.string(),
            {
                id: "GameCreateArgs.id",
                type: "prop",
                description: "The unique identifier for the game you want to create",
                example: BingoGameExample.id
            }
        ),
        hostName: registerSocketSchema(
            z.string(),
            {
                id: "GameCreateArgs.hostName",
                type: "prop",
                description: "The name of the player creating and therefore hosting the game",
                example: "Player1"
            }
        )
    }),
    {
        id: "GameCreateArgs",
        type: "args",
        eventName: SocketGameCreateEventName,
        description: `Arguments schema for the [${SocketGameCreateEventName}] event`,
    }
);

export const ZodSocketGameCreateSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "GameCreateSuccessResponse.game",
                type: "prop",
                description: "The newly created bingo game",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "GameCreateSuccessResponse",
        type: "success-response",
        eventName: SocketGameCreateEventName,
        description: `Response schema for a successful [${SocketGameCreateEventName}] event`,
    }
);

export const ZodSocketGameCreateResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameCreateSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameCreateResponse",
        type: "response",
        eventName: SocketGameCreateEventName,
        description: `Response schema for the [${SocketGameCreateEventName}] event`
    }
);

export type SocketGameCreateArgs = z.infer<typeof ZodSocketGameCreateArgsSchema>;
export type SocketGameCreateSuccessResponse = z.infer<typeof ZodSocketGameCreateSuccessResponseSchema>;
export type SocketGameCreateResponse = z.infer<typeof ZodSocketGameCreateResponseSchema>;