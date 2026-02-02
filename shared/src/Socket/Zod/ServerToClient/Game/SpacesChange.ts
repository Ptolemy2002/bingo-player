import { BingoGameExample } from "src/Bingo";
import { SocketSpaceOpExample, SocketSpaceOpArgsExample, registerSocketSchema, SocketSpaceOpEnum, ZodSocketSpaceOpSchema } from "src/Socket";
import { ZodMongoSpaceSchema, ZodSpaceIDSchema } from "src/Space";
import z from "zod";

export const SocketSpacesChangeEventName = "spacesChange" as const;

export const SocketSpacesChangeDataExample = {
    op: SocketSpaceOpExample,
    gameId: BingoGameExample.id,
    spaces: [...SocketSpaceOpArgsExample.spaces, BingoGameExample.spaces[0].spaceData]
} as const;

export const ZodSocketSpacesChangeDataSchema = registerSocketSchema(
    z.object({
        op: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodSocketSpaceOpSchema`.
            ZodSocketSpaceOpSchema.refine(() => true),
            {
                id: "SpacesChangeData.op",
                type: "prop",
                description: `The operation that was performed on the spaces. Options: ${JSON.stringify(SocketSpaceOpEnum)}`,
                example: SocketSpacesChangeDataExample.op
            }
        ),
        gameId: registerSocketSchema(
            z.string(),
            {
                id: "SpacesChangeData.gameId",
                type: "prop",
                description: "The unique identifier for the game where the spaces were changed. Must be a string.",
                example: SocketSpacesChangeDataExample.gameId
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
                            id: "SpacesChangeData.spaces.item<number>",
                            type: "prop",
                            description: "The index of the space that was changed. Must be a non-negative integer.",
                            example: SocketSpacesChangeDataExample.spaces[0] as number
                        }
                    ),

                    registerSocketSchema(
                        // This `refine` pattern allows us to copy the schema so that the original metadata
                        // is not overwritten on `ZodSpaceIDSchema`.
                        ZodSpaceIDSchema.refine(() => true),
                        {
                            id: "SpacesChangeData.spaces.item<string>",
                            type: "prop",
                            description: "The ID of the space that was changed. Must be a non-empty string.",
                            example: SocketSpacesChangeDataExample.spaces[1] as string
                        }
                    ),

                    registerSocketSchema(
                        // This `refine` pattern allows us to copy the schema so that the original metadata
                        // is not overwritten on `ZodMongoSpaceSchema`.
                        ZodMongoSpaceSchema.refine(() => true),
                        {
                            id: "SpacesChangeData.spaces.item<Space>",
                            type: "prop",
                            description: "The full space data that was added or changed. This may be used in  'add' operations to ensure the client has full data to update their local state without needing to make an additional fetch.",
                            example: SocketSpacesChangeDataExample.spaces[2] as z.infer<typeof ZodMongoSpaceSchema>
                        }
                    )
                ])
            ),

            {
                id: "SpacesChangeData.spaces",
                type: "prop",
                description: "The list of spaces that were changed, identified by either their index (non-negative integer) or ID (non-empty string).",
                example: SocketSpacesChangeDataExample.spaces as any // TypeScript bug with const arrays and unions
            }
        )
    }),
    {
        id: "SpacesChangeData",
        type: "message-data",
        eventName: SocketSpacesChangeEventName,
        description: "Data for when spaces in a game are changed",
        example: SocketSpacesChangeDataExample as any
    }
);

export type SocketSpacesChangeData = z.infer<typeof ZodSocketSpacesChangeDataSchema>;