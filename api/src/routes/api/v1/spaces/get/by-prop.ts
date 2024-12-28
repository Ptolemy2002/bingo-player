import { Router } from 'express';
import { transformRegex } from '@ptolemy2002/regex-utils';
import {
    GetSpacesByPropParams,
    CleanMongoSpace,
    interpretSpaceQueryProp,
    GetSpacesByPropQueryParamsInput,
    GetSpacesByPropQueryParamsOutput,
    GetSpacesByPropResponseBody,
    interpretSpaceQueryPropNonId,
    SpaceQueryPropNonId,
    ZodGetSpacesByPropParamsSchema,
    ZodGetSpacesByPropQueryParamsSchema
} from 'shared';
import SpaceModel from 'models/SpaceModel';
import getEnv from 'env';
import { PipelineStage } from 'mongoose';

const router = Router();

export async function getSpacesByProp(
    prop: SpaceQueryPropNonId,
    queryString: string,
    {
        limit,
        offset = 0,
        caseSensitive = false,
        accentSensitive = false,
        matchWhole = false,
        sortBy = "id",
        sortOrder = "asc",
    }: GetSpacesByPropQueryParamsOutput = {},
) {
    prop = interpretSpaceQueryPropNonId(prop);
    sortBy = interpretSpaceQueryProp(sortBy);

    const pattern = transformRegex(queryString, {
        caseInsensitive: !caseSensitive,
        accentInsensitive: !accentSensitive,
        matchWhole,
    });

    const sortOrderNum = sortOrder === "asc" ? 1 : -1;
    const sortObject: Record<string, 1 | -1> = {
        [sortBy === 'known-as' ? 'knownAs' : sortBy]: sortOrderNum
    };
    if (sortBy !== "_id") sortObject["_id"] = sortOrderNum;

    const aggregationPipeline: PipelineStage[] = [];

    // If query prop or sort prop is 'known-as', create 'knownAs' field
    if (prop === 'known-as' || sortBy === 'known-as') {
        aggregationPipeline.push({
            $addFields: {
                knownAs: { $concatArrays: [[ "$name"], "$aliases"] }
            }
        });
    }

    // Build match condition
    if (prop === 'known-as') {
        aggregationPipeline.push({
            $match: {
                knownAs: pattern
            }
        });
    } else {
        aggregationPipeline.push({
            $match: {
                [prop]: pattern
            }
        });
    }

    // Add sort stage
    aggregationPipeline.push({ $sort: sortObject });

    // If 'knownAs' field was created, remove it
    if (prop === 'known-as' || sortBy === 'known-as') {
        aggregationPipeline.push({ $unset: "knownAs" });
    }

    // Remove __v field
    aggregationPipeline.push({ $unset: "__v" });

    if (limit !== undefined) aggregationPipeline.push({ $limit: limit });
    if (offset !== undefined) aggregationPipeline.push({ $skip: offset });

    const query = SpaceModel.aggregate<CleanMongoSpace>(aggregationPipeline);
    return query.exec();
}

router.get<
    // Path
    '/get/by-prop/:prop/:query',
    // URL Parameters
    GetSpacesByPropParams,
    // Response body
    GetSpacesByPropResponseBody,
    // Request body
    {},
    // Query Parameters
    GetSpacesByPropQueryParamsInput
>('/get/by-prop/:prop/:query', async (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/by-prop/{prop}/{query}'
        #swagger.method = 'get'
        #swagger.description = `
            Get spaces by a given space query prop.
            The spaces are returned as an array of CleanMongoSpace objects.
        `
        #swagger.parameters['prop'] = {
            in: 'path',
            description: 'The space query prop to search.',
            required: true,
            type: 'string',
            schema: {
                $ref: "#/components/schemas/SpaceQueryPropNonId"
            }
        }

        #swagger.parameters['query'] = {
            in: 'path',
            description: 'The query string to search for.',
            required: true,
            type: 'string'
        }

        #swagger.parameters['$ref'] = [
            "#/components/parameters/offset",
            "#/components/parameters/o",

            "#/components/parameters/limit",
            "#/components/parameters/l",

            "#/components/parameters/caseSensitive",
            "#/components/parameters/cs",

            "#/components/parameters/accentSensitive",
            "#/components/parameters/as",

            "#/components/parameters/matchWhole",
            "#/components/parameters/mw",

            "#/components/parameters/sortBy",
            "#/components/parameters/sb",

            "#/components/parameters/sortOrder",
            "#/components/parameters/so"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/GetSpacesByProp200ResponseBody"
            }
        }

        #swagger.end
    */
    const env = getEnv();
    const help =
        env.getDocsURL(1) +
        '/#/Spaces/get_api_v1_spaces_get_by_prop__prop___query_';

    const {
        success: paramsSuccess,
        error: paramsError,
        data: propData,
    } = ZodGetSpacesByPropParamsSchema.safeParse(req.params);

    if (!paramsSuccess) {
        res.status(400).json({
            ok: false,
            code: 'BAD_URL',
            message: paramsError.errors[0].message,
        });
        return;
    }

    const { prop, query } = propData;
    const {
        success,
        error,
        data: queryData,
    } = ZodGetSpacesByPropQueryParamsSchema.safeParse(req.query);
    if (!success) {
        res.status(400).json({
            ok: false,
            code: 'BAD_QUERY',
            message: error.errors[0].message,
            help,
        });
        return;
    }

    const spaces = await getSpacesByProp(prop, query, queryData);
    if (spaces.length === 0) {
        res.status(404).json({
            ok: false,
            code: 'NOT_FOUND',
            message: 'No matching spaces found.',
            help,
        });
        return;
    }

    res.json({
        ok: true,
        spaces,
        help,
    });
});

const getSpacesByPropRouter = router;
export default getSpacesByPropRouter;
