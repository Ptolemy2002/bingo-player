import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Request, Response, Router } from "express";
import { CountSpaces200ResponseBody } from "shared";
import RouteHandler from "lib/RouteHandler";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";
import SpaceModel from "models/SpaceModel";

export const router = Router();

export class CountAllSpacesHandler extends RouteHandler {
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

    async handle(_: Request, res: Response) {
        const pipeline = new SpaceAggregationBuilder({
            countFieldName: "count"
        })
        .then("count")
        .build();

        const count = (await SpaceModel.aggregate<{count: number}>(pipeline))[0]?.count ?? 0;

        if (count === 0) {
            res.status(404).json(this.buildNotFoundResponse("No spaces found."));
            return;
        }

        res.status(200).json(this.buildSuccessResponse<CountSpaces200ResponseBody>({ count }));
    }
}

router.get('/count/all', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new CountAllSpacesHandler();
    return await handler.handle(req, res);
}));

const countAllSpacesRouter = router;
export default countAllSpacesRouter;
