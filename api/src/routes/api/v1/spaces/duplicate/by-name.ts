import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequestData } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { Types } from "mongoose";
import { DuplicateSpaceByID200ResponseBody, DuplicateSpaceByName200ResponseBody, ZodDuplicatSpaceByIDURLParamsSchema, ZodDuplicatSpaceByNameURLParamsSchema } from "shared";

const router = Router();

export class DuplicateSpaceByNameHandler extends RouteHandler<DuplicateSpaceByName200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Duplicate']
        #swagger.path = '/api/v1/spaces/duplicate/by-name/{name}'
        #swagger.method = 'post'
        #swagger.description = 'Duplicate an existing space in the database.'

        #swagger.parameters['name'] = {
            in: 'path',
            required: true,
            type: 'string',
            description: 'The name of the space to duplicate.'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/DuplicateSpaceByName200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/post_api_v1_spaces_duplicate_by_name__name_');
    }

    async generateResponse(req: RouteHandlerRequestData) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: params
        } = ZodDuplicatSpaceByNameURLParamsSchema.safeParse(req.params);

        if (!paramsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(paramsError, "BAD_URL")
            };
        }

        const { name } = params;

        const space = await SpaceModel.findOne({ name });

        if (space === null) {
            return {
                status: 404,
                response: this.buildNotFoundResponse("Space not found.")
            };
        }

        await space.makeNameUnique();
        
        // Set a new ID for the duplicated space and make sure it's marked as new.
        space._id = new Types.ObjectId();
        space.isNew = true;

        // Turn validation off, or pre-validate will try to
        // save again and fail.
        await space.save({ validateBeforeSave: false });

        return {
            status: 200,
            response: this.buildSuccessResponse({
                space: space.toClientJSON()
            })
        };
    }
}

router.post('/duplicate/by-name/:name', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new DuplicateSpaceByNameHandler();
    return await handler.handle(req, res);
}));

const duplicateSpaceByNameRouter = router;
export default duplicateSpaceByNameRouter;