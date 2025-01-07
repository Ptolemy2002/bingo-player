import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { UpdateSpaceByID200ResponseBody, UpdateSpaceByName200ResponseBody, ZodUpdateSpaceByIDParamsSchema, ZodUpdateSpaceByIDRequestBodySchema, ZodUpdateSpaceByNameParamsSchema, ZodUpdateSpaceByNameRequestBodySchema } from "shared";
import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Error } from "mongoose";

const router = Router();

export class UpdateSpaceByNameHandler extends RouteHandler<UpdateSpaceByName200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Update']
        #swagger.path = '/api/v1/spaces/update/by-name/{name}'
        #swagger.method = 'post'
        #swagger.description = 'Update an existing space in the database.'

        #swagger.requestBody = {
            required: true,
            schema: {
                $ref: "#/components/schemas/UpdateSpaceByNameRequestBody"
            }
        }

        #swagger.parameters['name'] = {
            in: 'path',
            required: true,
            type: 'string',
            description: 'The name of the space to update.'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/UpdateSpaceByName200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/post_api_v1_spaces_update_by_name__name_');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const {
            success: bodySuccess,
            error: bodyError,
            data: body
        } = ZodUpdateSpaceByNameRequestBodySchema.safeParse(req.body);

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
        } = ZodUpdateSpaceByNameParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { name } = params;

        const oldSpace = await SpaceModel.findOne({ name });
        if (oldSpace === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Space not found.")
            };
        }
        const oldSpaceJSON = oldSpace.toClientJSON();

        const newSpace = (await SpaceModel.findOneAndUpdate({ name }, body.difference, { new: true }))!;

        // Re-validate the space
        try {
            await newSpace.validate();
        } catch (_e) {
            // Find and replace with the original space
            await SpaceModel.findOneAndReplace({ name }, oldSpaceJSON);

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

router.post('/update/by-name/:name', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new UpdateSpaceByNameHandler();
    return await handler.handle(req, res);
}));

const updateSpaceByNameRouter = router;
export default updateSpaceByNameRouter;