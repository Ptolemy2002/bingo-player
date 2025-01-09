import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { SearchSpacesCount200ResponseBody, ZodSearchSpacesCountURLParamsSchema } from "shared";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";

const router = Router();

export class SearchSpacesCountHandler extends RouteHandler<SearchSpacesCount200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Count', 'Search']
        #swagger.path = '/api/v1/spaces/search/{query}/count'
        #swagger.method = 'get'
        #swagger.description = 'Use the Atlas Search index to search for spaces based on the provided query string. and return the count of the results.'

        #swagger.parameters['query'] = {
            in: 'path',
            description: 'The search query.',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/SearchSpacesCount200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_search__query_');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const {success: paramsSuccess, error: paramsError, data: paramsData} = ZodSearchSpacesCountURLParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_QUERY")
            };
        }

        const {query} = paramsData;

        const pipeline = new SpaceAggregationBuilder({}, this.help)
            .thenSearch({
                searchQuery: query,
            })
            .then("count")
            .build();

        const count = (await SpaceModel.aggregate<{count: number}>(pipeline))[0]?.count ?? 0;

        if (count === 0) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("No matching spaces found.")
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                count
            })
        };
    }
}

router.get('/search/:query/count', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new SearchSpacesCountHandler();
    return await handler.handle(req, res);
}));

const searchSpacesCountRouter = router;
export default searchSpacesCountRouter;