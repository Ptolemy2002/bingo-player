import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Request, Response, Router } from "express";
import RouteHandler from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { SearchSpaces200ResponseBody, ZodSearchParamsSchema, ZodSearchSpacesQueryParamsSchema } from "shared";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";

const router = Router();

export class SearchSpacesHandler extends RouteHandler {
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

    async handle(req: Request, res: Response) {
        const {success: querySuccess, error: queryError, data: queryData} = ZodSearchSpacesQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            res.status(400).json(this.buildZodErrorResponse(queryError, "BAD_QUERY"));
            return;
        }

        const {success: paramsSuccess, error: paramsError, data: paramsData} = ZodSearchParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            res.status(400).json(this.buildZodErrorResponse(paramsError, "BAD_URL"));
            return;
        }

        const {query} = paramsData;

        const pipeline = new SpaceAggregationBuilder(queryData)
            .thenSearch({
                searchQuery: query,
            })
            .then("sort-desc-default")
            .then("cleanup")
            .then("pagination")
            .build();

        const spaces = await SpaceModel.executeDocumentAggregation(pipeline);

        if (spaces.length === 0) {
            res.status(404)
                .json(this.buildNotFoundResponse("No matching spaces found."));
            return;
        }

        res.status(200).json(
            this.buildSuccessResponse<SearchSpaces200ResponseBody>({spaces})
        );
    }
}

router.get('/search/:query', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new SearchSpacesHandler();
    return await handler.handle(req, res);
}));

const searchSpacesRouter = router;
export default searchSpacesRouter;