import { ZodMongoSpaceSchema } from 'src/Space';
import { z } from 'zod';

export const ZodBingoSpaceSetSchema = z.array(
    z.object({
        isMarked: z.boolean().meta({
            description: "Indicates if the space is marked"
        }),
        spaceData: ZodMongoSpaceSchema.meta({
            description: "Data for the bingo space, including its ID and other properties. Matched the MongoDB schema for spaces."
        })
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
}).meta({
    id: "BingoSpaceSet",
    description: "Set of bingo spaces, each with a marked status and space data"
});

export type BingoSpaceSet = z.infer<typeof ZodBingoSpaceSetSchema>;