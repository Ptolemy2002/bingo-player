import { transformRegex } from '@ptolemy2002/regex-utils';
import {
    CountSpacesByPropParams,
    CountSpacesByPropQueryParamsOutput,
    CountSpacesByPropResponseBody,
    interpretSpaceQueryPropNonId,
    SpaceQueryPropNonId,
    ZodCountSpacesByPropParamsSchema,
    ZodCountSpacesByPropQueryParamsSchema
} from 'shared';
import SpaceModel from 'models/SpaceModel';
import { Router } from 'express';
import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import getEnv from 'env';

const router = Router();

export async function countSpacesByProp(
    prop: SpaceQueryPropNonId,
    queryString: string,
    {
        limit,
        offset = 0,
        caseSensitive = false,
        accentSensitive = false,
        matchWhole = false,
    }: CountSpacesByPropQueryParamsOutput = {},
) {
    // We should not get an id here, as the type of SpaceQueryPropNonId
    // omits any fields that map to "_id". The reason this is necessary
    // is because mongoose will otherwise attempt to convert the pattern
    // to an ObjectId, which will fail, as RegExp cannot be used directly
    // as a string.
    prop = interpretSpaceQueryPropNonId(prop);

    const pattern = transformRegex(queryString, {
        caseInsensitive: !caseSensitive,
        accentInsensitive: !accentSensitive,
        matchWhole,
    });

    let queryCondition;
    if (prop === 'known-as') {
        queryCondition = {
            $or: [{ name: pattern }, { aliases: pattern }],
        };
    } else {
        queryCondition = { [prop]: pattern };
    }

    const query = SpaceModel.countDocuments(queryCondition);
    if (limit) query.limit(limit);
    if (offset) query.skip(offset);
    return query.exec();
}
router.get<
    // Path
    "/count/by-prop/:prop/:query",
    // URL Parameters
    CountSpacesByPropParams,
    // Response body
    CountSpacesByPropResponseBody,
    // Request body
    {},
    // Query Parameters
    CountSpacesByPropQueryParamsOutput
>('/count/by-prop/:prop/:query', asyncErrorHandler(async (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/count/by-prop/{prop}/{query}'
        #swagger.method = 'get'
        #swagger.description = 'Get the number of spaces in the database matching the given query.'

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

        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Maximum number of spaces to count. By default, all spaces are counted.',
            required: false,
            type: 'number'
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
            "#/components/parameters/mw"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/CountSpacesByProp200ResponseBody"
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help =
        env.getDocsURL(1) +
        '/#/Spaces/get_api_v1_spaces_count_by_prop__prop___query_';

    const {
        success: paramsSuccess,
        error: paramsError,
        data: propData,
    } = ZodCountSpacesByPropParamsSchema.safeParse(req.params);

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
    } = ZodCountSpacesByPropQueryParamsSchema.safeParse(req.query);
    if (!success) {
        res.status(400).json({
            ok: false,
            code: 'BAD_QUERY',
            message: error.errors[0].message,
            help,
        });
        return;
    }

    const count = await countSpacesByProp(prop, query, queryData);
    if (count === 0) {
        res.status(404).json({
            ok: false,
            code: "NOT_FOUND",
            message: "No spaces found.",
            help
        });
        return;
    }

    res.json({
        ok: true,
        count,
        help
    });
}));

const countSpacesByPropRouter = router;
export default countSpacesByPropRouter;
