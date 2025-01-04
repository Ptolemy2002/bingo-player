import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import { Router } from 'express';
import RouteHandler, { RouteHandlerRequest } from 'lib/RouteHandler';
import SpaceModel from 'models/SpaceModel';
import {
    ZodListSpacePropByPropParamsSchema,
    ZodListSpacePropByPropQueryParamsSchema,
    ListSpacePropByProp200ResponseBody,
} from 'shared';
import SpaceAggregationBuilder from '../utils/SpaceAggregationBuilder';

const router = Router();

export class ListSpacePropByPropHandler extends RouteHandler<ListSpacePropByProp200ResponseBody> {
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

            "#/components/parameters/sortOrder",
            "#/components/parameters/so",

            "#/components/parameters/invert",
            "#/components/parameters/i"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/ListSpacePropByProp200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_all_list__prop_');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: paramsData,
        } = ZodListSpacePropByPropParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const {
            success: querySuccess,
            error: queryError,
            data: queryData,
        } = ZodListSpacePropByPropQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(queryError, "BAD_QUERY")
            };
        }

        const { queryProp, query: queryString, listProp } = paramsData;

        const pipeline = new SpaceAggregationBuilder(queryData, this.help)
            .then("add-known-as")
            .thenMatch({
                queryProp,
                queryString,
            })
            .thenUnwindListProp({
                listProp
            })
            .then("group-list-prop")
            .thenSort({
                // The group stage will include each group's value
                // under the _id field.
                sortBy: "_id"
            })
            .then("pagination")
            .then("cleanup")
            .build();
        
        const values = await SpaceModel.aggregate<{_id: string}>(pipeline).exec();

        if (values.length === 0) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("No matching spaces found.")
            };
        }

        const propValues = values.map(({_id}) => _id);
        return {
            status: 200,
            response: this.buildSuccessResponse({
                values: propValues
            })
        };
    }
}


router.get('/get/by-prop/:queryProp/:query/list/:listProp', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new ListSpacePropByPropHandler();
    return await handler.handle(req, res);
}));

const listSpacePropValuesByPropRouter = router;
export default listSpacePropValuesByPropRouter;
