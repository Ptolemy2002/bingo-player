import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import { Router } from 'express';
import RouteHandler, { ExpressRouteHandlerRequestData } from 'lib/ExpressRouteHandler';
import SpaceModel from 'models/SpaceModel';
import {
    ListSpaceProp200ResponseBody,
    ZodListSpacePropURLParamsSchema,
    ZodListSpacePropQueryParamsSchema,
} from 'shared';
import SpaceAggregationBuilder from '../utils/SpaceAggregationBuilder';

const router = Router();

export class ListAllSpacePropValuesHandler extends RouteHandler<ListSpaceProp200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'List']
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
            "#/components/parameters/l",

            "#/components/parameters/sortOrder",
            "#/components/parameters/so"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/ListSpaceProp200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_all_list__prop_');
    }

    async generateResponse(req: ExpressRouteHandlerRequestData) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: paramsData,
        } = ZodListSpacePropURLParamsSchema.safeParse(req.params);

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
        } = ZodListSpacePropQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(queryError, "BAD_QUERY")
            };
        }

        const { prop: listProp } = paramsData;
        const pipeline = new SpaceAggregationBuilder(queryData, this.help)
            .then("add-known-as")
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

router.get('/get/all/list/:prop', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new ListAllSpacePropValuesHandler();
    return await handler.handle(req, res);
}));

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;
