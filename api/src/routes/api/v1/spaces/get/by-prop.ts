import { Router } from "express";
import { transformRegex } from "@ptolemy2002/regex-utils";
import { GetSpacesByPropParams, GetSpacesByPropQueryParamsInput, GetSpacesByPropQueryParamsOutput, GetSpacesResponseBody, interpretSpaceQueryProp, ListPropParams, SpaceQueryProp, ZodGetSpacesQueryParamsSchema, ZodSpaceQueryPropSchema } from "shared";
import SpaceModel from "models/SpaceModel";
import { Query } from "mongoose";
import getEnv from "env";

const router = Router();

export async function getSpacesByProp(prop: SpaceQueryProp, queryString: string, {
    limit,
    offset=0,
    caseSensitive=false,
    accentSensitive=false,
    matchWhole=false,
}: GetSpacesByPropQueryParamsOutput = {}) {
    prop = interpretSpaceQueryProp(prop);

    const pattern = transformRegex(queryString, {
        caseInsensitive: !caseSensitive,
        accentInsensitive: !accentSensitive,
        matchWhole
    })
    
    let queryCondition;
    if (prop === "known-as") {
        queryCondition = {
            $or: [
                {name: pattern},
                {aliases: pattern}
            ]
        }
    } else {
        queryCondition = {[prop]: pattern};
    }

    const query = SpaceModel.find(queryCondition);
    if (limit) query.limit(limit);
    if (offset) query.skip(offset);
    return query.exec();
}

router.get<
    // Path
    "/get/by-prop/:prop/:query",
    // URL Parameters
    GetSpacesByPropParams,
    // Response body
    GetSpacesResponseBody,
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

        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Maximum number of spaces to return. By default, all spaces are returned.',
            required: false,
            type: 'number'
        }

        #swagger.parameters['l'] = {
            in: 'query',
            description: 'Shorthand for limit.',
            required: false,
            type: 'number'
        }
        
        #swagger.parameters['offset'] = {
            in: 'query',
            description: 'Number of spaces to skip. Default is 0.',
            required: false,
            type: 'number'
        }

        #swagger.parameters['o'] = {
            in: 'query',
            description: 'Shorthand for offset.',
            required: false,
            type: 'number'
        }

        #swagger.parameters['caseSensitive'] = {
            in: 'query',
            description: 'Whether to match in a case-sensitive manner. Default is false.',
            required: false,
            type: 'boolean'
        }

        #swagger.parameters['cs'] = {
            in: 'query',
            description: 'Shorthand for caseSensitive.',
            required: false,
            type: 'boolean'
        }

        #swagger.parameters['accentSensitive'] = {
            in: 'query',
            description: 'Whether to match accents. Default is false.',
            required: false,
            type: 'boolean'
        }

        #swagger.parameters['as'] = {
            in: 'query',
            description: 'Shorthand for accentSensitive.',
            required: false,
            type: 'boolean'
        }

        #swagger.parameters['matchWhole'] = {
            in: 'query',
            description: 'Whether to match the whole string. Default is false.',
            required: false,
            type: 'boolean'
        }

        #swagger.parameters['mw'] = {
            in: 'query',
            description: 'Shorthand for matchWhole.',
            required: false,
            type: 'boolean'
        }

        #swagger.responses[200] = {
            description: "Spaces found",
            schema: {
                $ok: true,
                $spaces: [
                    { $ref: "#/components/schemas/CleanMongoSpace" }
                ],
                help: "https://example.com/docs"
            }
        }

        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_by_prop__prop___query_";

    const {prop: _prop, query} = req.params;
    const {success: propSuccess, error: propError, data: prop} = ZodSpaceQueryPropSchema.safeParse(_prop);

    if (!propSuccess) {
        res.status(400).json({
            ok: false,
            code: "BAD_URL",
            message: propError.errors[0].message
        });
        return;
    }

    const {success, error, data: queryData} = ZodGetSpacesQueryParamsSchema.safeParse(req.query);
    if (!success) {
        res.status(400).json({
            ok: false,
            code: "BAD_QUERY",
            message: error.errors[0].message,
            help
        });
        return;
    }

    const spaces = await getSpacesByProp(prop, query, queryData);
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
        spaces: spaces.map(s => s.toClientJSON()),
        help
    });
});

const getSpacesByPropRouter = router;
export default getSpacesByPropRouter;