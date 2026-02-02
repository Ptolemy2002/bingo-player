import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema } from "src/Socket/Registry";
import { z } from "zod";

export const SocketGameListEventName = "gameList" as const;

export const ZodSocketGameListArgsSchema = registerSocketSchema(
    z.object({
        mine: registerSocketSchema(
            z.union([
                z.stringbool(),
                z.boolean()
            ]).default(false),
            {
                id: "GameListArgs.mine",
                type: "prop",
                description: 
                    "Whether to include only games you are a part of in the list. " +
                    "Parses common affirmative and negative strings to booleans, " +
                    "case insensitively. Defaults to false.",
                examples: [
                    true, false,
                    "true", "1", "yes", "on", "y", "enabled",
                    "false", "0", "no", "off", "n", "disabled"
                ]
            }
        )
    }), {
        id: "GameListArgs",
        type: "args",
        eventName: SocketGameListEventName,
        description: `List all available bingo games. Set \`mine\` to true to only include games you are a part of.`
    }
);

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
        description: `Each game currently in the database, or only those you are a part of if \`mine\` was true.`,
        example: {
            ok: true,
            help: "http://bingo.api/docs#event-gameList",
            games: [BingoGameExample]
        } as any // To avoid TS error about excess properties in the example
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
        description: `Response schema for the [${SocketGameListEventName}] event`,
        example: {
            ok: false,
            code: "UNKNOWN",
            message: "An unknown error occurred.",
            help: "http://bingo.api/docs#event-gameList",
        }
    }
);

export type SocketGameListArgs = z.input<typeof ZodSocketGameListArgsSchema>;
export type SocketGameListSuccessResponse = z.infer<typeof ZodSocketGameListSuccessResponseSchema>;
export type SocketGameListResponse = z.infer<typeof ZodSocketGameListResponseSchema>;