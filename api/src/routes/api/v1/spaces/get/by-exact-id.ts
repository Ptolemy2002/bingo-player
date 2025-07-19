import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { ExpressRouteHandlerRequestData } from "lib/ExpressRouteHandler";
import SpaceModel from "models/SpaceModel";
import { GetSpaceByExactID200ResponseBody, ZodGetSpaceByExactIDURLParamsSchema } from "shared";

const router = Router();

export class GetSpaceByExactIDHandler extends RouteHandler<GetSpaceByExactID200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Get']
        #swagger.path = '/api/v1/spaces/get/by-id/{id}'
        #swagger.method = 'get'
        #swagger.description = "Get the space with the exact given ID."

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'The ID of the space to get.',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/GetSpaceByExactID200ResponseBody"
            }
        }

        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/get_api_v1_spaces_get_by_id__id_');
    }

    async generateResponse(req: ExpressRouteHandlerRequestData) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: params
        } = ZodGetSpaceByExactIDURLParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { id } = params;
        const space = await SpaceModel.findOne({ _id: id });

        if (space === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Space not found.")
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                space: space.toClientJSON()
            })
        };
    }
}

router.get('/get/by-id/:id', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new GetSpaceByExactIDHandler();
    return await handler.handle(req, res);
}));

const getSpaceByExactIDRouter = router;
export default getSpaceByExactIDRouter;