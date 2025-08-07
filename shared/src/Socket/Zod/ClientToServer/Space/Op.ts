import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema, SocketSpaceOpExample, ZodSocketSpaceOpSchema } from "src/Socket";
import { ZodSpaceIDSchema } from "src/Space";
import { z } from "zod";

export const SocketSpaceOpArgsExample = {
    gameId: BingoGameExample.id,
    op: SocketSpaceOpExample,
    spaces: [0, "abc123"]
};

export const SocketSpaceOpEventName = "spaceOp" as const;

export const ZodSocketSpaceOpArgsSchema = registerSocketSchema(
    z.object({
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "SpaceOpArgs.gameId",
                description: "The unique identifier for the game you want to perform the operation on",
                example: SocketSpaceOpArgsExample.gameId
            }
        ),

        
        op: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoPlayerSetSchema`.
            ZodSocketSpaceOpSchema.refine(() => true),
            {
                id: "SpaceOpArgs.op",
                description: "The operation to perform on the spaces",
                example: SocketSpaceOpArgsExample.op
            }
        ),

        spaces: registerSocketSchema(
            z.array(
                z.union([
                    registerSocketSchema(
                        z.number().int().min(0, {
                            error: "Space index must be a non-negative integer, as the game's space set is zero-indexed."
                        }),
                        {
                            id: "SpaceOpArgs.spaces.index",
                            description: "The index of the space to operate on",
                            example: SocketSpaceOpArgsExample.spaces[0] as number
                        }
                    ),

                    registerSocketSchema(
                        // This `refine` pattern allows us to copy the schema so that the original metadata
                        // is not overwritten on `ZodBingoPlayerSetSchema`.
                        ZodSpaceIDSchema.refine(() => true),
                        {
                            id: "SpaceOpArgs.spaces.id",
                            description: "The ID of the space to operate on",
                            example: SocketSpaceOpArgsExample.spaces[1] as string
                        }
                    )

                ])
            ),
            {
                id: "SpaceOpArgs.spaces",
                description: "The spaces to operate on",
                example: SocketSpaceOpArgsExample.spaces
            }
        )
    }),
    {
        id: "SpaceMarkAllArgs",
        description: `Arguments schema for the [${SocketSpaceOpEventName}] event`,
    }
);

export const ZodSocketSpaceOpSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({})),
    {
        id: "SpaceOpSuccessResponse",
        description: `Response schema for a successful [${SocketSpaceOpEventName}] event`
    }
);

export const ZodSocketSpaceOpResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketSpaceOpSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "SpaceOpResponse",
        description: `Response schema for the [${SocketSpaceOpEventName}] event`
    }
);

export type SocketSpaceOpArgs = z.infer<typeof ZodSocketSpaceOpArgsSchema>;
export type SocketSpaceOpSuccessResponse = z.infer<typeof ZodSocketSpaceOpSuccessResponseSchema>;
export type SocketSpaceOpResponse = z.infer<typeof ZodSocketSpaceOpResponseSchema>;