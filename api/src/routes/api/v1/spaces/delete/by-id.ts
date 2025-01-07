import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { DeleteSpaceByID200ResponseBody, ZodDeleteSpaceByIDParamsSchema } from "shared";

const router = Router();

export class DeleteSpaceByIDHandler extends RouteHandler<DeleteSpaceByID200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Delete']
        #swagger.path = '/api/v1/spaces/delete/by-id/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Delete a space by ID.'

        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            description: 'The ID of the space to delete.',
            type: 'string'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/DeleteSpaceByID200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/delete_api_v1_spaces_delete_by_id_{id}');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const { success: paramsSuccess, error: paramsError, data: params } = ZodDeleteSpaceByIDParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { id } = params;

        const result = await SpaceModel.findOneAndDelete({ _id: id });

        if (result === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Space not found.")
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                deleted: true
            })
        };
    }
}

router.delete('/delete/by-id/:id', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new DeleteSpaceByIDHandler();
    return await handler.handle(req, res);
}));

const deleteSpaceByIDRouter = router;
export default deleteSpaceByIDRouter;
