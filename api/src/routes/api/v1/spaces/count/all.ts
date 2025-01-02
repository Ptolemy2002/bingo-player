import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import { CountSpaces200ResponseBody } from "shared";
import RouteHandler from "lib/RouteHandler";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";
import SpaceModel from "models/SpaceModel";

const router = Router();

export class CountAllSpacesHandler extends RouteHandler<CountSpaces200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Count']
        #swagger.path = '/api/v1/spaces/count/all'
        #swagger.method = 'get'
        #swagger.description = 'Get the number of spaces in the database.'

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/CountSpaces200ResponseBody"
            }
        }
        #swagger.end
    */

    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_count_all');
    }

    async generateResponse() {
        const pipeline = new SpaceAggregationBuilder({
            countFieldName: "count"
        })
        .then("count")
        .build();

        const count = (await SpaceModel.aggregate<{count: number}>(pipeline))[0]?.count ?? 0;

        if (count === 0) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("No spaces found.")
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({ count })
        };
    }
}

router.get('/count/all', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new CountAllSpacesHandler();
    return await handler.handle(req, res);
}));

const countAllSpacesRouter = router;
export default countAllSpacesRouter;
