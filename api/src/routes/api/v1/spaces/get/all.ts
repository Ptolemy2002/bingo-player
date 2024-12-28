import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { interpretZodError } from "@ptolemy2002/regex-utils";
import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { PipelineStage } from "mongoose";
import { CleanMongoSpace, GetSpacesQueryParams, GetSpacesResponseBody, interpretSortOrder, interpretSpaceQueryProp, ZodGetSpacesQueryParamsSchema } from "shared";

const router = Router();

export async function getAllSpaces({
    limit, offset, sortBy="id", sortOrder="asc"
}: GetSpacesQueryParams = {}) {
    const aggregationPipeline: PipelineStage[] = [];

    const sortOrderNum = interpretSortOrder(sortOrder) === "asc" ? 1 : -1;
    const sortObject: Record<string, 1 | -1> = {};

    sortBy = interpretSpaceQueryProp(sortBy);
    if (sortBy === "known-as") {
        sortObject["knownAs"] = sortOrderNum;
    } else {
        sortObject[sortBy] = sortOrderNum;
    }
    if (sortBy !== "_id") sortObject["_id"] = sortOrderNum;

    // Check if the "known-as" was used for sorting
    const usedKnownAs = (sortBy  === "known-as");

    if (usedKnownAs) {
        aggregationPipeline.push({ 
            $addFields: { knownAs: { $concatArrays: [[ "$name" ], "$aliases"] } } 
        });
    }

    aggregationPipeline.push({ $sort: sortObject });

    if (usedKnownAs) {
        aggregationPipeline.push({$unset: "knownAs"}); 
    }

    if (limit !== undefined) aggregationPipeline.push({ $limit: limit });
    if (offset !== undefined) aggregationPipeline.push({ $skip: offset });

    // Populate all properties
    aggregationPipeline.push({ $replaceRoot: { newRoot: "$$ROOT" } });

    const query = SpaceModel.aggregate<CleanMongoSpace>(aggregationPipeline);
    return query.exec();
}

router.get<
    // Path
    "/get/all",
    // URL Parameters
    {},
    // Response body
    GetSpacesResponseBody,
    // Request body
    {},
    // Query Parameters
    GetSpacesQueryParams
>('/get/all', asyncErrorHandler(async (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all'
        #swagger.method = 'get'
        #swagger.description = 'Get all spaces in the database.'

        #swagger.parameters['$ref'] = [
            "#/components/parameters/limit",
            "#/components/parameters/l",

            "#/components/parameters/offset",
            "#/components/parameters/o",

            "#/components/parameters/sortBy",
            "#/components/parameters/sb",

            "#/components/parameters/sortOrder",
            "#/components/parameters/so"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/GetSpaces200ResponseBody"
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_all";

    const {success, error, data: query} = ZodGetSpacesQueryParamsSchema.safeParse(req.query);

    if (!success) {
        res.status(400).json({
            ok: false,
            code: "BAD_QUERY",
            message: interpretZodError(error),
            help
        });
        return;
    }

    const spaces = await getAllSpaces(query);
    if (spaces.length === 0) {
        res.status(404).json({
            ok: false,
            code: "NOT_FOUND",
            message: "No matching spaces found.",
            help
        });
        return;
    }

    res.json({
        ok: true,
        spaces,
        help
    });
}));

const getAllSpacesRouter = router;
export default getAllSpacesRouter;