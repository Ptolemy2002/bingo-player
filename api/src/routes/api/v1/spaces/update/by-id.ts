import { Router } from "express";
import RouteHandler, { RouteHandlerRequestData } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { UpdateSpaceByID200ResponseBody, ZodUpdateSpaceByIDURLParamsSchema, ZodUpdateSpaceByIDRequestBodySchema } from "shared";
import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Error } from "mongoose";

const router = Router();

export class UpdateSpaceByIDHandler extends RouteHandler<UpdateSpaceByID200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Update']
        #swagger.path = '/api/v1/spaces/update/by-id/{id}'
        #swagger.method = 'post'
        #swagger.description = 'Update an existing space in the database.'

        #swagger.requestBody = {
            required: true,
            schema: {
                $ref: "#/components/schemas/UpdateSpaceByIDRequestBody"
            }
        }

        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'string',
            description: 'The ID of the space to update.'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/UpdateSpaceByID200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/post_api_v1_spaces_update_by_id__id_');
    }

    async generateResponse(req: RouteHandlerRequestData) {
        const {
            success: bodySuccess,
            error: bodyError,
            data: body
        } = ZodUpdateSpaceByIDRequestBodySchema.safeParse(req.body);

        if (!bodySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(bodyError, "BAD_BODY")
            };
        }

        const {
            success: paramsSuccess,
            error: paramsError,
            data: params
        } = ZodUpdateSpaceByIDURLParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { id } = params;

        const oldSpace = await SpaceModel.findOne({ _id: id });
        if (oldSpace === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Space not found.")
            };
        }
        const oldSpaceJSON = oldSpace.toClientJSON();

        const newSpace = (await SpaceModel.findOneAndUpdate({ _id: id }, body.difference, { new: true }))!;
        newSpace.removeUnsetFields();

        // Re-validate the space
        try {
            await newSpace.validate();
        } catch (_e) {
            // Find and replace with the original space
            await SpaceModel.findOneAndReplace({ _id: id }, oldSpaceJSON);

            const e = _e as Error.ValidationError;
            return {
                status: 500,
                response: this.buildErrorResponse("VALIDATION", e.message)
            };
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                space: newSpace.toClientJSON()
            })
        };
    }
}

router.post('/update/by-id/:id', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new UpdateSpaceByIDHandler();
    return await handler.handle(req, res);
}));

const updateSpaceByIDRouter = router;
export default updateSpaceByIDRouter;