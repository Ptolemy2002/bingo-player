import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { interpretSpaceQueryPropWithScore, SearchSpacesListProp200ResponseBody, ZodSearchSpacesListPropParamsSchema, ZodSearchSpacesListPropQueryParamsSchema } from "shared";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";

const router = Router();

export class SearchSpacesListPropHandler extends RouteHandler<SearchSpacesListProp200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'List', 'Search']
        #swagger.path = '/api/v1/spaces/search/{query}/list/{prop}'
        #swagger.method = 'get'
        #swagger.description = `
            Use the Atlas Search index to get all values for a given space query prop that appear in the spaces that match
            the given query. The values are returned as an array of objects, each containing a value and a relevance score
            for the document containing that value with the highest relevance. The value is a string, but may be null.
        `

        #swagger.parameters['query'] = {
            in: 'path',
            description: 'The search query.',
            required: true,
            type: 'string'
        }

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
            "#/components/parameters/limit",
            "#/components/parameters/l",

            "#/components/parameters/offset",
            "#/components/parameters/o",

            "#/components/parameters/sortOrderDescDefault",
            "#/components/parameters/soDescDefault",

            "#/components/parameters/sortBySearchListProp",
            "#/components/parameters/sbSearchListProp"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/SearchSpacesListProp200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_search__query__count_list__prop_');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const {success: paramsSuccess, error: paramsError, data: paramsData} = ZodSearchSpacesListPropParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { query, prop } = paramsData;

        const { success: querySuccess, error: queryError, data: _queryData } = ZodSearchSpacesListPropQueryParamsSchema.safeParse(req.query);

        if (!querySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(queryError, "BAD_QUERY")
            };
        }

        const { sortBy, ...queryData } = _queryData;

        const pipeline = new SpaceAggregationBuilder(queryData)
            .thenSearch({
                searchQuery: query,
            })
            .then({
                // Save the score to be added later.
                $addFields: {
                    // Get from the existing score that was added
                    // in the search stage.
                    savedScore: "$_score"
                }
            })
            .then("add-known-as")
            .thenUnwindListProp({
                listProp: prop
            })
            .then({
                $group: {
                    _id: `$${interpretSpaceQueryPropWithScore(prop)}`,
                    // Save the highest score for each group.
                    _score: {
                        $max: "$savedScore"
                    }
                }
            })
            .thenSort({
                // If sorting by value, sort by _id, as that's the field
                // where the value is stored.
                sortBy: sortBy === "value" ? "_id" : sortBy
            })
            .then("pagination")
            .then("cleanup")
            .build();

        const values = await SpaceModel.aggregate<{_id: string, _score: number}>(pipeline);

        if (values.length === 0) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("No matching spaces found.")
            };
        }

        const propValues = values.map(({_id, _score}) => ({
            value: _id,
            _score
        }));

        return {
            status: 200,
            response: this.buildSuccessResponse({
                values: propValues
            })
        };
    }
}

router.get('/search/:query/list/:prop', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new SearchSpacesListPropHandler();
    return await handler.handle(req, res);
}));

const searchSpacesListPropRouter = router;
export default searchSpacesListPropRouter;