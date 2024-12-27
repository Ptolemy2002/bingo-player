import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import { interpretZodError } from '@ptolemy2002/regex-utils';
import getEnv from 'env';
import { Router } from 'express';
import SpaceModel from 'models/SpaceModel';
import { PipelineStage } from 'mongoose';
import {
    interpretSpaceQueryProp,
    ListPropParams,
    ListPropQueryParams,
    ListPropResponseBody,
    SpaceQueryProp,
    ZodListPropParamsSchema,
    ZodListPropQueryParamsSchema,
} from 'shared';

const router = Router();

export async function listAllSpacePropValues(prop: SpaceQueryProp, {
    limit,
    offset = 0
}: ListPropQueryParams): Promise<(string | null)[]> {
    prop = interpretSpaceQueryProp(prop);

    let aggregationPipeline: PipelineStage[] = [];
    if (prop === "known-as") {
        // If the property is "known-as", combine "name" and "aliases" into a single array
        aggregationPipeline = [
            { 
                $project: { knownAs: { $concatArrays: [[ "$name" ], "$aliases"] } } 
            },
            { $unwind: "$knownAs" },
            { $group: { _id: "$knownAs" } },
            { $skip: offset }
        ];
    } else {
        aggregationPipeline = [
            { $unwind: { path: `$${prop}`, preserveNullAndEmptyArrays: true } },
            { $group: { _id: `$${prop}` } },
            { $skip: offset }
        ];
    }
    if (limit) aggregationPipeline.push({ $limit: limit });

    const query = SpaceModel.aggregate(aggregationPipeline);

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
    // Path
    '/get/all/list/:prop',
    // URL Parameters
    ListPropParams,
    // Response body
    ListPropResponseBody,
    // Request body
    {},
    // Query Parameters
    ListPropQueryParams
>(
    '/get/all/list/:prop',
    asyncErrorHandler(async (req, res) => {
        /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all/list/{prop}'
        #swagger.method = 'get'
        #swagger.description = `
            Get all values for a given space query prop.
            The values are returned as an array of strings, but may contain null values.
        `
        #swagger.parameters['prop'] = {
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
            "#/components/parameters/l"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/ListProp200ResponseBody"
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
        } = ZodListPropParamsSchema.safeParse(req.params);
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
        } = ZodListPropQueryParamsSchema.safeParse(req.query);
        if (!querySuccess) {
            res.status(400).json({
                ok: false,
                code: 'BAD_QUERY',
                message: interpretZodError(queryError),
                help,
            });
            return;
        }

        const { prop } = params;
        res.json({
            ok: true,
            values: await listAllSpacePropValues(prop, query),
            help,
        });
    }),
);

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;
