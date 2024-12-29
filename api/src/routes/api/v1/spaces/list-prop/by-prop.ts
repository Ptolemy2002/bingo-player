import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import { interpretZodError, transformRegex } from '@ptolemy2002/regex-utils';
import getEnv from 'env';
import { Router } from 'express';
import SpaceModel from 'models/SpaceModel';
import { PipelineStage } from 'mongoose';
import {
    interpretSortOrder,
    interpretSpaceQueryProp,
    ListPropByPropResponseBody,
    SpaceQueryProp,
    ListPropByPropQueryParams,
    ListPropByPropParams,
    ZodListPropByPropParamsSchema,
    ZodListPropByPropQueryParamsSchema,
} from 'shared';

const router = Router();

export async function listSpacePropValuesByProp(
    queryProp: SpaceQueryProp,
    queryString: string,
    listProp: SpaceQueryProp,
    {
        limit,
        offset = 0,
        sortBy="id",
        sortOrder="asc",
        caseSensitive = false,
        accentSensitive = false,
        matchWhole = false,
    }: ListPropByPropQueryParams): Promise<(string | null)[]> {
    queryProp = interpretSpaceQueryProp(queryProp);
    listProp = interpretSpaceQueryProp(listProp);

    const pattern = transformRegex(queryString, {
        caseInsensitive: !caseSensitive,
        accentInsensitive: !accentSensitive,
        matchWhole,
    });

    const sortOrderNum = interpretSortOrder(sortOrder);
    const sortObject: Record<string, 1 | -1> = {};

    sortBy = interpretSpaceQueryProp(sortBy);
    if (sortBy === "known-as") {
        sortObject["knownAs"] = sortOrderNum;
    } else {
        sortObject[sortBy] = sortOrderNum;
    }

    if (sortBy !== "_id") sortObject["_id"] = sortOrderNum;

    let aggregationPipeline: PipelineStage[] = [];
    if (listProp === "known-as") {
        // If the property is "known-as", combine "name" and "aliases" into a single array
        aggregationPipeline = [
            { 
                $project: { knownAs: { $concatArrays: [[ "$name" ], "$aliases"] } } 
            },
            { $match: { knownAs: pattern } },
            { $unwind: "$knownAs" },
            { $group: { _id: "$knownAs" } },
            { $sort: sortObject },
            { $skip: offset }
        ];
    } else {
        aggregationPipeline = [
            { $match: { [queryProp]: pattern } },
            { $unwind: { path: `$${listProp}`, preserveNullAndEmptyArrays: true } },
            { $group: { _id: `$${listProp}` } },
            { $sort: sortObject },
            { $skip: offset }
        ];
    }

    // Remove __v field
    aggregationPipeline.push({ $unset: "__v" });

    if (limit !== undefined) aggregationPipeline.push({ $limit: limit });

    const query = SpaceModel.aggregate<{_id: string}>(aggregationPipeline);

    const values = await query.exec();
    // Extract and format the actual values
    return values.map(v => v._id).map((v) => {
        if (v === null) {
            return null;
        }
        
        return String(v);
    });
}


router.get<
    // URL Parameters
    ListPropByPropParams,
    // Response body
    ListPropByPropResponseBody,
    // Request body
    {},
    // Query Parameters
    ListPropByPropQueryParams
>(
    '/get/by-prop/:queryProp/:query/list/:listProp',
    asyncErrorHandler(async (req, res) => {
        /*
        #swagger.start
        #swagger.tags = ['Spaces', 'List', 'Query']
        #swagger.path = '/api/v1/spaces/get/by-prop/{queryProp}/{query}/list/{listProp}'
        #swagger.method = 'get'
        #swagger.description = `
            Get all values for a given space query prop that appear in the spaces that match the given query.
            The values are returned as an array of strings, but may contain null values.
        `

        #swagger.parameters['queryProp'] = {
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

        #swagger.parameters['listProp'] = {
            in: 'path',
            description: 'The space query prop to list.',
            required: true,
            type: 'string',
            schema: {
                $ref: "#/components/schemas/SpaceQueryProp"
            }
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
                $ref: "#/components/schemas/ListPropByProp200ResponseBody"
            }
        }
        #swagger.end
    */
        const env = getEnv();
        const help =
            env.getDocsURL(1) +
            '/#/Spaces/get_api_v1_spaces_get_all_list__prop_';
        
        const {
            success: paramsSuccess,
            error: paramsError,
            data: params,
        } = ZodListPropByPropParamsSchema.safeParse(req.params);
        if (!paramsSuccess) {
            res.status(400).json({
                ok: false,
                code: 'BAD_URL',
                message: interpretZodError(paramsError),
                help,
            });
            return;
        }

        const {
            success: querySuccess,
            error: queryError,
            data: query,
        } = ZodListPropByPropQueryParamsSchema.safeParse(req.query);
        if (!querySuccess) {
            res.status(400).json({
                ok: false,
                code: 'BAD_QUERY',
                message: interpretZodError(queryError),
                help,
            });
            return;
        }

        const { queryProp, query: queryString, listProp } = params;
        res.json({
            ok: true,
            values: await listSpacePropValuesByProp(queryProp, queryString, listProp, query),
            help,
        });
    }),
);

const listSpacePropValuesByPropRouter = router;
export default listSpacePropValuesByPropRouter;
