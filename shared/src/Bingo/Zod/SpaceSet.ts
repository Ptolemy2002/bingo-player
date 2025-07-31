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
];

export const ZodBingoSpaceSetSchema = registerBingoSchema(
    z.array(
        z.object({
            isMarked: registerBingoSchema(
                z.boolean(),
                {
                    id: "BingoSpaceSet.isMarked",
                    description: "Indicates if the space is marked",
                    example: BingoSpaceSetExample[0].isMarked
                }
            ),
            spaceData: registerBingoSchema(
                // This `refine` pattern allows us to copy the schema so that the original metadata
                // is not overwritten on `ZodMongoSpaceSchema`.
                ZodMongoSpaceSchema.refine(() => true),
                {
                    id: "BingoSpaceSet.spaceData",
                    description: "Data for the bingo space, including its ID and other properties. Matched the MongoDB schema for spaces."
                }
            )
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
    }),
    {
        id: "BingoSpaceSet",
        description: "Set of bingo spaces, each with a marked status and space data",
        example: BingoSpaceSetExample
    }
);

export type BingoSpaceSet = z.infer<typeof ZodBingoSpaceSetSchema>;