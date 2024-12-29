import { Router, Request, Response } from 'express';
import {
    CleanMongoSpace,
    ZodGetSpacesByPropParamsSchema,
    ZodGetSpacesByPropQueryParamsSchema,
    GetSpacesByProp200ResponseBody
} from 'shared';
import SpaceModel from 'models/SpaceModel';
import RouteHandler from 'lib/RouteHandler';
import SpaceAggregationBuilder from '../utils/SpaceAggregationBuilder';
import { asyncErrorHandler } from '@ptolemy2002/express-utils';

const router = Router();

export class GetSpacesByPropHandler extends RouteHandler {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Get', 'Query']
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
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_by_prop__prop___query_');
    }

    async handle(req: Request, res: Response) {
        const { success: paramsSuccess, error: paramsError, data: params } = ZodGetSpacesByPropParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            res.status(400)
                .json(this.buildZodErrorResponse(paramsError, "BAD_URL"));
            return;
        }

        const { prop: queryProp, query: queryString } = params;
        const { success: querySuccess, error: queryError, data: queryData } = ZodGetSpacesByPropQueryParamsSchema.safeParse(req.query);
        if (!querySuccess) {
            res.status(400)
                .json(this.buildZodErrorResponse(queryError, "BAD_QUERY"));
            return;
        }

        const pipeline = new SpaceAggregationBuilder(queryData)
            .then("add-known-as")
            .thenMatch({ queryProp, queryString })
            .then("sort")
            .then("cleanup")
            .then("pagination")
            .build();
        
        const spaces = await SpaceModel.aggregate<CleanMongoSpace>(pipeline).exec();

        if (spaces.length === 0) {
            res.status(404)
                .json(this.buildNotFoundResponse("No matching spaces found."));
            return;
        }

        res.status(200)
            .json(this.buildSuccessResponse<GetSpacesByProp200ResponseBody>({ spaces }));
        return;
    }
}

router.get('/get/by-prop/:prop/:query', asyncErrorHandler(async (req, res) => {
    const handler = new GetSpacesByPropHandler();
    return await handler.handle(req, res);
}));

const getSpacesByPropRouter = router;
export default getSpacesByPropRouter;