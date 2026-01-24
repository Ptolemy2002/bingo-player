import { BingoGameExample, ZodBingoSpaceTagConditionSchema, ZodBingoGameSchema } from "src/Bingo";
import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { registerSocketSchema } from "src/Socket";
import { z } from "zod";

export const SocketSpaceFillArgsExample = {
    gameId: BingoGameExample.id,
    maxSpaces: 10,
    condition: ["common", "rare"]
};

export const SocketSpaceFillEventName = "spaceFill" as const;

export const ZodSocketSpaceFillArgsSchema = registerSocketSchema(
    z.object({
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "SpaceFillArgs.gameId",
                type: "prop",
                description: "The unique identifier for the game you want to fill with spaces. Must be a string.",
                example: SocketSpaceFillArgsExample.gameId
            }
        ),

        maxSpaces: registerSocketSchema(
            z.number().int().min(1, {
                error: "maxSpaces must be at least 1."
            }),
            {
                id: "SpaceFillArgs.maxSpaces",
                type: "prop",
                description: "The maximum number of spaces to fill in the game. Must be a positive integer.",
                example: SocketSpaceFillArgsExample.maxSpaces
            }
        ),

        condition: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoSpaceTagConditionSchema`.
            ZodBingoSpaceTagConditionSchema.refine(() => true),
            {
                id: "SpaceFillArgs.condition",
                type: "prop",
                description: "The condition to use when selecting spaces to fill. Can be a string, an advanced condition object, or an array of strings and/or advanced condition objects.",
                example: SocketSpaceFillArgsExample.condition
            }
        )
    }),
    {
        id: "SocketSpaceFillArgs",
        type: "args",
        description: "Fill a game with spaces based on the provided conditions.",
        eventName: SocketSpaceFillEventName,
        example: SocketSpaceFillArgsExample
    }
);

export const ZodSocketSpaceFillSuccessResponseSchema = zodSuccessResponseSchema(
    registerSocketSchema(
        z.object({
            filledSpacesCount: registerSocketSchema(
                z.number().int().min(0),
                {
                    id: "SpaceFillSuccessResponse.filledSpacesCount",
                    type: "prop",
                    description: "The number of spaces that were filled in the game.",
                    example: 10
                }
            ),
            game: registerSocketSchema(
                // This `refine` pattern allows us to copy the schema so that the original metadata
                // is not overwritten on `ZodBingoGameSchema`.
                ZodBingoGameSchema.refine(() => true),
                {
                    id: "SpaceFillSuccessResponse.game",
                    type: "prop",
                    description: "The updated bingo game after filling spaces.",
                    example: BingoGameExample
                }
            )
        }),
        {
            id: "SpaceFillSuccessResponse",
            type: "success-response",
            eventName: SocketSpaceFillEventName,
            description: "The number of spaces filled and the updated game after a successful space fill operation."
        }
    )
);

export const ZodSocketSpaceFillResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketSpaceFillSuccessResponseSchema,
        ZodErrorResponseSchema
    ]),
    {
        id: "SpaceFillResponse",
        type: "response",
        eventName: SocketSpaceFillEventName,
        description: `Response schema for the [${SocketSpaceFillEventName}] event.`
    }
);

export type SocketSpaceFillArgs = z.infer<typeof ZodSocketSpaceFillArgsSchema>;
export type SocketSpaceFillSuccessResponse = z.infer<typeof ZodSocketSpaceFillSuccessResponseSchema>;
export type SocketSpaceFillResponse = z.infer<typeof ZodSocketSpaceFillResponseSchema>;