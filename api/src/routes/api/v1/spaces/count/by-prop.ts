import { Request, Response, Router } from 'express';
import { asyncErrorHandler } from '@ptolemy2002/express-utils';
import RouteHandler from 'lib/RouteHandler';
import { ZodCountSpacesByPropParamsSchema, ZodCountSpacesByPropQueryParamsSchema,CountSpacesByProp200ResponseBody } from 'shared';
import SpaceAggregationBuilder from '../utils/SpaceAggregationBuilder';
import SpaceModel from 'models/SpaceModel';
import { register } from 'module';

const router = Router();

export class CountSpacesByPropHandler extends RouteHandler {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Count', 'Query']
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
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_count_by_prop__prop___query_');
    }

    async handle(req: Request, res: Response) {
        const { success: paramsSuccess, error: paramsError, data: params } = ZodCountSpacesByPropParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            res.status(400).json(this.buildZodErrorResponse(paramsError));
            return;
        }

        const { prop: queryProp, query: queryString } = params;
        const { success: querySuccess, error: queryError, data: queryData } = ZodCountSpacesByPropQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            res.status(400).json(this.buildZodErrorResponse(queryError));
            return;
        }

        const pipeline = new SpaceAggregationBuilder(queryData)
            .then("add-known-as")
            .thenMatch({
                queryProp,
                queryString
            })
            .then("count")
            .build();

        const count = (await SpaceModel.aggregate<{ count: number }>(pipeline))[0]?.count ?? 0;
        
        if (count === 0) {
            res.status(404).json(this.buildNotFoundResponse("No spaces found."));
            return;
        }

        res.status(200).json(this.buildSuccessResponse<CountSpacesByProp200ResponseBody>({ count }));
    }
}

router.get('/count/by-prop/:prop/:query', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new CountSpacesByPropHandler();
    return await handler.handle(req, res);
}));

const countSpacesByPropRouter = router;
export default countSpacesByPropRouter;
