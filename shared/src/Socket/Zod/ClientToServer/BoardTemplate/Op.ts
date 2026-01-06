import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema, BingoBoardTemplateExample, ZodBingoBoardTemplateSchema } from "src/Bingo";
import { registerSocketSchema, SocketBoardTemplateOpExample, ZodSocketBoardTemplateOpSchema } from "src/Socket";
import { z, ZodObject, ZodString, ZodType, ZodOptional, ZodArray } from "zod";

export const SocketBoardTemplateOpArgsExample = {
    gameId: BingoGameExample.id,
    op: SocketBoardTemplateOpExample,
    templates: [BingoBoardTemplateExample],
    templateNames: ["Standard 5x5 Template"]
};

export const SocketBoardTemplateOpEventName = "boardTemplateOp" as const;

type SocketBoardTemplateOp = z.infer<typeof ZodSocketBoardTemplateOpSchema>;

function zodSocketBoardTemplateOpArgsBase<T extends SocketBoardTemplateOp, TT extends "name" | "full">(
    op: T,
    templatesType: TT,
    register: <ZT extends ZodType>(prop: keyof typeof SocketBoardTemplateOpArgsExample, s: ZT) => ZT = (_, s) => s
): ZodObject<{
    gameId: z.ZodString;
    op: z.ZodLiteral<T>;
    templates: TT extends "full" ? ZodArray<typeof ZodBingoBoardTemplateSchema> : ZodOptional<ZodArray<typeof ZodBingoBoardTemplateSchema>>;
    templateNames: TT extends "name" ? ZodArray<ZodString> : ZodOptional<ZodArray<ZodString>>;
}> {
    // "as any" is used here to avoid TypeScript issues with the conditional types above.
    return z.object({
        gameId: register("gameId", z.string()),
        op: register("op", z.literal(op)),
        templates: register("templates", templatesType === "full" ? z.array(ZodBingoBoardTemplateSchema) : z.array(ZodBingoBoardTemplateSchema).optional()),
        templateNames: register("templateNames", templatesType === "name" ? z.array(z.string()) : z.array(z.string()).optional())
    }) as any;
}

function createPropertyRegister(op: SocketBoardTemplateOp, descriptions: Record<keyof typeof SocketBoardTemplateOpArgsExample, { description: string; example: any }>) {
    return <ZT extends ZodType>(prop: keyof typeof SocketBoardTemplateOpArgsExample, s: ZT) => {
        const desc = descriptions[prop];
        return registerSocketSchema(s, {
            id: `BoardTemplateOpArgs[${op}].${prop}`,
            type: "prop",
            description: desc.description,
            example: desc.example as any
        });
    };
}

export const ZodSocketBoardTemplateOpArgsSchema = registerSocketSchema(
    z.discriminatedUnion("op", [
        registerSocketSchema(
            zodSocketBoardTemplateOpArgsBase("add", "full", createPropertyRegister("add", {
                gameId: { description: "The unique identifier for the game you want to perform the operation on. Must be a string.", example: SocketBoardTemplateOpArgsExample.gameId },
                op: { description: `The operation to perform on the board templates (in this case, "add")`, example: "add" },
                templates: { description: "An array of complete board template objects to add. Each template must include all required properties (id, shape, grid, key).", example: SocketBoardTemplateOpArgsExample.templates },
                templateNames: { description: "Not used for add operations", example: undefined }
            })),
            {
                id: "BoardTemplateOpArgs[add]",
                type: "args",
                description: `Arguments for adding board templates in the '${SocketBoardTemplateOpEventName}' socket event.`
            }
        ),

        registerSocketSchema(
            zodSocketBoardTemplateOpArgsBase("remove", "name", createPropertyRegister("remove", {
                gameId: { description: "The unique identifier for the game you want to perform the operation on. Must be a string.", example: SocketBoardTemplateOpArgsExample.gameId },
                op: { description: `The operation to perform on the board templates (in this case, "remove")`, example: "remove" },
                templates: { description: "Not used for remove operations", example: undefined },
                templateNames: { description: "An array of template identifiers (names) to remove. Each must be a string matching the id of a template.", example: SocketBoardTemplateOpArgsExample.templateNames }
            })),
            {
                id: "BoardTemplateOpArgs[remove]",
                type: "args",
                description: `Arguments for removing board templates in the '${SocketBoardTemplateOpEventName}' socket event.`
            }
        )
    ]),
    {
        id: "BoardTemplateOpArgs",
        type: "args",
        description: `Arguments for the '${SocketBoardTemplateOpEventName}' socket event.`,
        example: SocketBoardTemplateOpArgsExample
    }
);

export const ZodSocketBoardTemplateOpSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "BoardTemplateOpSuccessResponse.game",
                type: "prop",
                description: "The current state of the bingo game after a board template operation was performed.",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "BoardTemplateOpSuccessResponse",
        type: "success-response",
        description: `The updated state of the bingo game after a board template operation was performed successfully.`
    }
);

export const ZodSocketBoardTemplateOpResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketBoardTemplateOpSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "BoardTemplateOpResponse",
        type: "response",
        description: `Response schema for the [${SocketBoardTemplateOpEventName}] event`
    }
);

export type SocketBoardTemplateOpResponse = z.infer<typeof ZodSocketBoardTemplateOpResponseSchema>;
export type SocketBoardTemplateOpSuccessResponse = z.infer<typeof ZodSocketBoardTemplateOpSuccessResponseSchema>;
export type SocketBoardTemplateOpArgs = z.infer<typeof ZodSocketBoardTemplateOpArgsSchema>;
