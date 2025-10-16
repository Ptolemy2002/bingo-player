import { BingoGameExample, BingoPlayerExamples } from "src/Bingo";
import { SocketPlayersChangeTypeEnum } from "src/Socket/Other";
import { registerSocketSchema } from "src/Socket/Registry";
import { z, ZodNullable, ZodObject, ZodString, ZodType, ZodOptional } from "zod";

export const SocketPlayersChangeEventName = "playersChange" as const;

export const SocketPlayersChangeDataExample = {
    type: "join",
    gameId: BingoGameExample.id,
    prevPlayerName: null,
    newPlayerName: BingoPlayerExamples[0].name
} as const;

export const ZodSocketPlayersChangeTypeSchema = registerSocketSchema(
    z.enum(SocketPlayersChangeTypeEnum),
    {
        id: "PlayersChangeType",
        type: "other",
        description: "The type of change that may have occurred to the players in a game",
        example: "join"
    }
);

function zodSocketPlayersChangeDataBase<T extends SocketPlayersChangeType, PO extends boolean, NO extends boolean>(
    type: T,
    prevOptional: PO,
    newOptional: NO,
    register: <ZT extends ZodType>(prop: keyof typeof SocketPlayersChangeDataExample, s: ZT) => ZT = (_, s) => s
): ZodObject<{
    type: z.ZodLiteral<T>;
    gameId: z.ZodString;
    prevPlayerName: PO extends true ? ZodOptional<ZodNullable<ZodString>> : ZodString;
    newPlayerName: NO extends true ? ZodOptional<ZodNullable<ZodString>> : ZodString;
}> {
    // "as any" is used here to avoid TypeScript issues with the conditional types above.
    return z.object({
        type: register("type", z.literal(type)),
        gameId: register("gameId", z.string()),
        prevPlayerName: register("prevPlayerName", prevOptional ? z.string().nullable().optional() : z.string()),
        newPlayerName: register("newPlayerName", newOptional ? z.string().nullable().optional() : z.string())
    }) as any;
}


function createPropertyRegister(type: SocketPlayersChangeType, descriptions: Record<keyof typeof SocketPlayersChangeDataExample, { description: string; example: any }>) {
    return <ZT extends ZodType>(prop: keyof typeof SocketPlayersChangeDataExample, s: ZT) => {
        const desc = descriptions[prop];
        return registerSocketSchema(s, {
            id: `PlayersChangeData[${type}].${prop}`,
            type: "prop",
            description: desc.description,
            example: desc.example as any
        });
    };
}

// This is a ServerToClient event. We only have the Data type.
export const SocketPlayersChangeDataSchema = registerSocketSchema(
    z.discriminatedUnion("type", [
        registerSocketSchema(
            zodSocketPlayersChangeDataBase("join", true, false, createPropertyRegister("join", {
                type: { description: `The type of change that occurred (in this case, "join")`, example: "join" },
                gameId: { description: `The ID of the game the player joined`, example: BingoGameExample.id },
                prevPlayerName: { description: `The previous name of the player (optional and irrelevant when joining)`, example: null },
                newPlayerName: { description: `The new name of the player who joined`, example: BingoPlayerExamples[0].name }
            })),
            {
                id: "PlayersChangeData[join]",
                type: "message-data",
                eventName: SocketPlayersChangeEventName,
                description: `Data for when a player joins a game`
            }
        ),

        registerSocketSchema(
            zodSocketPlayersChangeDataBase("leave", false, true, createPropertyRegister("leave", {
                type: { description: `The type of change that occurred (in this case, "leave")`, example: "leave" },
                gameId: { description: `The ID of the game the player left`, example: BingoGameExample.id },
                prevPlayerName: { description: `The previous name of the player who left`, example: BingoPlayerExamples[0].name },
                newPlayerName: { description: `The new name of the player (optional and irrelevant when leaving or disconnecting)`, example: null }
            })),
            {
                id: "PlayersChangeData[leave]",
                type: "message-data",
                eventName: SocketPlayersChangeEventName,
                description: `Data for when a player leaves a game`
            }
        ),

        registerSocketSchema(
            zodSocketPlayersChangeDataBase("disconnect", false, true, createPropertyRegister("disconnect", {
                type: { description: `The type of change that occurred (in this case, "disconnect")`, example: "disconnect" },
                gameId: { description: `The ID of the game the player disconnected from`, example: BingoGameExample.id },
                prevPlayerName: { description: `The previous name of the player who disconnected`, example: BingoPlayerExamples[0].name },
                newPlayerName: { description: `The new name of the player (optional and irrelevant when leaving or disconnecting)`, example: null }
            })),
            {
                id: "PlayersChangeData[disconnect]",
                type: "message-data",
                eventName: SocketPlayersChangeEventName,
                description: `Data for when a player disconnects from a game`
            }
        ),

        registerSocketSchema(
            zodSocketPlayersChangeDataBase("nameChange", false, false, createPropertyRegister("nameChange", {
                type: { description: `The type of change that occurred (in this case, "nameChange")`, example: "nameChange" },
                gameId: { description: `The ID of the game the player changed their name in`, example: BingoGameExample.id },
                prevPlayerName: { description: `The previous name of the player who changed their name`, example: BingoPlayerExamples[0].name },
                newPlayerName: { description: `The new name of the player who changed their name`, example: BingoPlayerExamples[1].name }
            })),
            {
                id: "PlayersChangeData[nameChange]",
                type: "message-data",
                eventName: SocketPlayersChangeEventName,
                description: `Data for when a player changes their name in a game`
            }
        )
    ]),

    {
        id: "PlayersChangeData",
        type: "message-data",
        eventName: SocketPlayersChangeEventName,
        description: `Data for when a player joins, leaves, or changes their name in a game`
    }
);

export type SocketPlayersChangeType = z.infer<typeof ZodSocketPlayersChangeTypeSchema>;
export type SocketPlayersChangeData = z.infer<typeof SocketPlayersChangeDataSchema>;