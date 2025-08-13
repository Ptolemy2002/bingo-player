import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameListEventName = "gameList" as const;

export const ZodSocketGameListArgsSchema = registerSocketSchema(z.undefined(), {
    id: "GameListArgs",
    type: "args",
    eventName: SocketGameListEventName,
    description: `Arguments schema for the [${SocketGameListEventName}] event`
});

export const ZodSocketGameListSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        games: registerSocketSchema(
            z.array(ZodBingoGameSchema),
            {
                id: "GameListSuccessResponse.games",
                type: "prop",
                description: "An array of all available bingo games",
                example: [BingoGameExample]
            }
        )
    })),
    {
        id: "GameListSuccessResponse",
        type: "success-response",
        eventName: SocketGameListEventName,
        description: `Response schema for a successful [${SocketGameListEventName}] event`
    }
);

export const ZodSocketGameListResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketGameListSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "GameListResponse",
        type: "response",
        eventName: SocketGameListEventName,
        description: `Response schema for the [${SocketGameListEventName}] event`
    }
);

export type SocketGameListArgs = z.infer<typeof ZodSocketGameListArgsSchema>;
export type SocketGameListSuccessResponse = z.infer<typeof ZodSocketGameListSuccessResponseSchema>;
export type SocketGameListResponse = z.infer<typeof ZodSocketGameListResponseSchema>;