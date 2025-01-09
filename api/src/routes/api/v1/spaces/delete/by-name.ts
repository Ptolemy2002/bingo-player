import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { DeleteSpaceByName200ResponseBody, ZodDeleteSpaceByIDURLParamsSchema, ZodDeleteSpaceByNameURLParamsSchema } from "shared";

const router = Router();

export class DeleteSpaceByNameHandler extends RouteHandler<DeleteSpaceByName200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Delete']
        #swagger.path = '/api/v1/spaces/delete/by-name/{name}'
        #swagger.method = 'delete'
        #swagger.description = 'Delete a space by name.'

        #swagger.parameters['name'] = {
            in: 'path',
            required: true,
            description: 'The name of the space to delete.',
            type: 'string'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/DeleteSpaceByName200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/delete_api_v1_spaces_delete_by_id_{id}');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const { success: paramsSuccess, error: paramsError, data: params } = ZodDeleteSpaceByNameURLParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { name } = params;

        const result = await SpaceModel.findOneAndDelete({ name });

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

router.delete('/delete/by-name/:name', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new DeleteSpaceByNameHandler();
    return await handler.handle(req, res);
}));

const deleteSpaceByNameRouter = router;
export default deleteSpaceByNameRouter;