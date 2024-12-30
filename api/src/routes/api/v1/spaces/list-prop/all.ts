import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import { Request, Response, Router } from 'express';
import RouteHandler from 'lib/RouteHandler';
import SpaceModel from 'models/SpaceModel';
import {
    ListProp200ResponseBody,
    ZodListPropParamsSchema,
    ZodListPropQueryParamsSchema,
} from 'shared';
import SpaceAggregationBuilder from '../utils/SpaceAggregationBuilder';

const router = Router();

export class ListAllSpacePropValuesHandler extends RouteHandler {
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
                $ref: "#/components/schemas/ListProp200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_all_list__prop_');
    }

    async handle(req: Request, res: Response) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: paramsData,
        } = ZodListPropParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            res.status(400).json(this.buildZodErrorResponse(paramsError, "BAD_URL"));
            return;
        }

        const {
            success: querySuccess,
            error: queryError,
            data: queryData,
        } = ZodListPropQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            res.status(400).json(this.buildZodErrorResponse(queryError, "BAD_QUERY"));
            return;
        }

        const { prop: listProp } = paramsData;
        const pipeline = new SpaceAggregationBuilder(queryData)
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
            res.status(404).json(this.buildNotFoundResponse("No matching spaces found."));
            return;
        }

        const propValues = values.map(({_id}) => _id);
        res.status(200).json(
            this.buildSuccessResponse<ListProp200ResponseBody>({values: propValues})
        );
    }
}

router.get('/get/all/list/:prop', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new ListAllSpacePropValuesHandler();
    return await handler.handle(req, res);
}));

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;
