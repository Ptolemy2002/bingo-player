import { MaybeZodOptional, zodGenericFactory } from "@ptolemy2002/regex-utils";
import { ZodErrorResponseSchema, zodSuccessResponseSchema } from "src/Api";
import { BingoGameExample, ZodBingoGameSchema } from "src/Bingo";
import { registerSocketSchema, SocketBoardOpExample, ZodSocketBoardOpSchema } from "src/Socket";
import { z, ZodObject, ZodLiteral, ZodString, ZodType, ZodOptional, ZodArray } from "zod";

export const SocketBoardOpArgsExample = {
    gameId: BingoGameExample.id,
    op: SocketBoardOpExample,
    boards: ["board123", "board456"],
    template: "template789"
};

export const SocketBoardOpEventName = "boardOp" as const;

type SocketBoardOp = z.infer<typeof ZodSocketBoardOpSchema>;

const zodSocketBoardOpGeneric = zodGenericFactory<
    [ZodLiteral<SocketBoardOp>, MaybeZodOptional<ZodString>],
    ZodObject<{
        gameId: ZodString;
        op: ZodLiteral<SocketBoardOp>;
        boards: ZodArray<ZodString>;
        template: MaybeZodOptional<ZodString>;
    }>
>();

function zodSocketBoardOpArgsBase<T extends SocketBoardOp, TemplateOptional extends boolean>(
    op: T,
    templateOptional: TemplateOptional,
    register: <ZT extends ZodType>(prop: keyof typeof SocketBoardOpArgsExample, s: ZT) => ZT = (_, s) => s
): ZodObject<{
    gameId: ZodString;
    op: ZodLiteral<T>;
    boards: ZodArray<ZodString>;
    template: TemplateOptional extends true ? ZodOptional<ZodString> : ZodString;
}> {
    return zodSocketBoardOpGeneric(
        z.literal(op),
        templateOptional ? z.string().optional() : z.string()
    )(
        (opSchema, templateSchema) => z.object({
            gameId: register("gameId", z.string()),
            op: register("op", opSchema),
            boards: register("boards", z.array(z.string())),
            template: register("template", templateSchema)
        })
    ) as any; // Used to make sure Typescript doesn't complain about the conditional type in the return.
}

function createPropertyRegister(op: SocketBoardOp, descriptions: Record<keyof typeof SocketBoardOpArgsExample, { description: string; example: any }>) {
    return <ZT extends ZodType>(prop: keyof typeof SocketBoardOpArgsExample, s: ZT) => {
        const desc = descriptions[prop];
        return registerSocketSchema(s, {
            id: `BoardOpArgs[${op}].${prop}`,
            type: "prop",
            description: desc.description,
            example: desc.example as any
        });
    };
}

export const ZodSocketBoardOpArgsSchema = registerSocketSchema(
    z.discriminatedUnion("op", [
        registerSocketSchema(
            zodSocketBoardOpArgsBase("add", false, createPropertyRegister("add", {
                gameId: { description: "The unique identifier for the game you want to perform the operation on. Must be a string.", example: SocketBoardOpArgsExample.gameId },
                op: { description: `The operation to perform on the boards (in this case, "add")`, example: "add" },
                boards: { description: "An array of unique identifiers of the boards to add. Each must be a string.", example: SocketBoardOpArgsExample.boards },
                template: { description: "The unique identifier of the template to base the new boards on. Must be a string. Required when adding boards.", example: SocketBoardOpArgsExample.template }
            })),
            {
                id: "BoardOpArgs[add]",
                type: "prop",
                description: `Arguments for adding boards in the '${SocketBoardOpEventName}' socket event.`
            }
        ),

        registerSocketSchema(
            zodSocketBoardOpArgsBase("remove", true, createPropertyRegister("remove", {
                gameId: { description: "The unique identifier for the game you want to perform the operation on. Must be a string.", example: SocketBoardOpArgsExample.gameId },
                op: { description: `The operation to perform on the boards (in this case, "remove")`, example: "remove" },
                boards: { description: "An array of unique identifiers of the boards to remove. Each must be a string.", example: SocketBoardOpArgsExample.boards },
                template: { description: "The template identifier (optional and irrelevant when removing boards)", example: undefined }
            })),
            {
                id: "BoardOpArgs[remove]",
                type: "prop",
                description: `Arguments for removing boards in the '${SocketBoardOpEventName}' socket event.`
            }
        )
    ]),
    {
        id: "BoardOpArgs",
        type: "args",
        eventName: SocketBoardOpEventName,
        description: `Arguments for the '${SocketBoardOpEventName}' socket event.`,
        example: SocketBoardOpArgsExample
    }
);

export const ZodSocketBoardOpSuccessResponseSchema = registerSocketSchema(
    zodSuccessResponseSchema(z.object({
        game: registerSocketSchema(
            // This `refine` pattern allows us to copy the schema so that the original metadata
            // is not overwritten on `ZodBingoGameSchema`.
            ZodBingoGameSchema.refine(() => true),
            {
                id: "BoardOpSuccessResponse.game",
                type: "prop",
                description: "The current state of the bingo game an operation was performed on.",
                example: BingoGameExample
            }
        )
    })),
    {
        id: "BoardOpSuccessResponse",
        type: "success-response",
        eventName: SocketBoardOpEventName,
        description: `The updated state of the bingo game after a board operation was performed successfully.`
    }
);

export const ZodSocketBoardOpResponseSchema = registerSocketSchema(
    z.union([
        ZodSocketBoardOpSuccessResponseSchema,
        ZodErrorResponseSchema,
    ]),
    {
        id: "BoardOpResponse",
        type: "response",
        eventName: SocketBoardOpEventName,
        description: `Response schema for the [${SocketBoardOpEventName}] event`
    }
);

export type SocketBoardOpResponse = z.infer<typeof ZodSocketBoardOpResponseSchema>;
export type SocketBoardOpSuccessResponse = z.infer<typeof ZodSocketBoardOpSuccessResponseSchema>;
export type SocketBoardOpArgs = z.infer<typeof ZodSocketBoardOpArgsSchema>;