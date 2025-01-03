import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { SearchSpaces200ResponseBody, ZodSearchSpacesParamsSchema, ZodSearchSpacesQueryParamsSchema } from "shared";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";

const router = Router();

export class SearchSpacesHandler extends RouteHandler<SearchSpaces200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Get', 'Search']
        #swagger.path = '/api/v1/spaces/search/{query}'
        #swagger.method = 'get'
        #swagger.description = 'Use the Atlas Search index to search for spaces based on the provided query string.'

        #swagger.parameters['query'] = {
            in: 'path',
            description: 'The search query.',
            required: true,
            type: 'string'
        }

        #swagger.parameters['$ref'] = [
            "#/components/parameters/limit",
            "#/components/parameters/l",

            "#/components/parameters/offset",
            "#/components/parameters/o",

            "#/components/parameters/sortByWithScore",
            "#/components/parameters/sbWithScore",

            "#/components/parameters/sortOrderDescDefault",
            "#/components/parameters/soDescDefault"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/SearchSpaces200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_search__query_');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const {success: querySuccess, error: queryError, data: queryData} = ZodSearchSpacesQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(queryError, "BAD_QUERY")
            };
        }

        const {success: paramsSuccess, error: paramsError, data: paramsData} = ZodSearchSpacesParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const {query} = paramsData;

        const pipeline = new SpaceAggregationBuilder(queryData, this.help)
            .thenSearch({
                searchQuery: query,
            })
            .then("sort-desc-default")
            .then("cleanup")
            .then("pagination")
            .build();

        const spaces = await SpaceModel.executeDocumentAggregation(pipeline);

        if (spaces.length === 0) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("No matching spaces found.")
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                spaces
            })
        };
    }
}

router.get('/search/:query', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new SearchSpacesHandler();
    return await handler.handle(req, res);
}));

const searchSpacesRouter = router;
export default searchSpacesRouter;