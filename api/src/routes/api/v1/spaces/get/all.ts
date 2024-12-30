import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Request, Response, Router } from "express";
import RouteHandler from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { GetSpaces200ResponseBody, ZodGetSpacesQueryParamsSchema } from "shared";
import SpaceAggregationBuilder from "../utils/SpaceAggregationBuilder";

const router = Router();

export class GetAllSpacesHandler extends RouteHandler {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Get']
        #swagger.path = '/api/v1/spaces/get/all'
        #swagger.method = 'get'
        #swagger.description = 'Get all spaces in the database.'

        #swagger.parameters['$ref'] = [
            "#/components/parameters/limit",
            "#/components/parameters/l",

            "#/components/parameters/offset",
            "#/components/parameters/o",

            "#/components/parameters/sortBy",
            "#/components/parameters/sb",

            "#/components/parameters/sortOrder",
            "#/components/parameters/so"
        ]

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/GetSpaces200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_all');
    }

    async handle(req: Request, res: Response) {
        const {success, error, data: query} = ZodGetSpacesQueryParamsSchema.safeParse(req.query);

        if (!success) {
            res.status(400).json(this.buildZodErrorResponse(error, "BAD_QUERY"));
            return;
        }

        const pipeline = new SpaceAggregationBuilder(query)
            .then("add-known-as")
            .then("sort")
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
            this.buildSuccessResponse<GetSpaces200ResponseBody>({spaces})
        );
    }
}

router.get('/get/all', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new GetAllSpacesHandler();
    return await handler.handle(req, res);
}));

const getAllSpacesRouter = router;
export default getAllSpacesRouter;