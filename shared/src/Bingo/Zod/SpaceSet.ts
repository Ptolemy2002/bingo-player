import { ZodMongoSpaceSchema } from 'src/Space';
import { z } from 'zod';
import { registerBingoSchema } from 'src/Bingo/Registry';

export const BingoSpaceSetExample = [
    {
        isMarked: false,
        spaceData: {
            _id: "abc123",
            name: "My Space",
            aliases: ["Alias 1", "Alias 2"],
            description: "A free space in the center of the bingo card",
            examples: ["Example 1", "Example 2"],
            tags: ["tag-1", "in:collection-1"]
        }
    }
] as const;

const BingoSpaceSetIsMarkedSchema = z.boolean();
registerBingoSchema(BingoSpaceSetIsMarkedSchema, {
    id: "BingoSpaceSet.isMarked",
    description: "Indicates if the space is marked",
    example: BingoSpaceSetExample[0].isMarked
});

const BingoSpaceSetSpaceDataSchema = ZodMongoSpaceSchema;
registerBingoSchema(BingoSpaceSetSpaceDataSchema, {
    id: "BingoSpaceSet.spaceData",
    description: "Data for the bingo space, including its ID and other properties. Matched the MongoDB schema for spaces."
});

export const ZodBingoSpaceSetSchema = z.array(
    z.object({
        isMarked: BingoSpaceSetIsMarkedSchema,
        spaceData: BingoSpaceSetSpaceDataSchema
    })
).superRefine((spaceSet, ctx) => {
    const seenIds: string[] = [];
    for (const [index, entry] of spaceSet.entries()) {
        if (seenIds.includes(entry.spaceData._id)) {
            ctx.addIssue({
                code: "custom",
                message: `No two spaces in this list should have the same ID.`,
                path: ["spaces", index, "spaceData", "_id"]
            });
        } else {
            seenIds.push(entry.spaceData._id);
        }
    }
});

registerBingoSchema(ZodBingoSpaceSetSchema, {
    id: "BingoSpaceSet",
    description: "Set of bingo spaces, each with a marked status and space data",
    example: BingoSpaceSetExample
});

export type BingoSpaceSet = z.infer<typeof ZodBingoSpaceSetSchema>;