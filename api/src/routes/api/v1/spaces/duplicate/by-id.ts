import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { ExpressRouteHandlerRequestData } from "lib/ExpressRouteHandler";
import SpaceModel from "models/SpaceModel";
import { Types } from "mongoose";
import { DuplicateSpaceByID200ResponseBody, ZodDuplicatSpaceByIDURLParamsSchema } from "shared";

const router = Router();

export class DuplicateSpaceByIDHandler extends RouteHandler<DuplicateSpaceByID200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'Duplicate']
        #swagger.path = '/api/v1/spaces/duplicate/by-id/{id}'
        #swagger.method = 'post'
        #swagger.description = 'Duplicate an existing space in the database.'

        #swagger.parameters['id'] = {
            in: 'path',
            required: true,
            type: 'string',
            description: 'The ID of the space to duplicate.'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/DuplicateSpaceByID200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/post_api_v1_spaces_duplicate_by_id__id_');
    }

    async generateResponse(req: ExpressRouteHandlerRequestData) {
        const {
            success: paramsSuccess,
            error: paramsError,
            data: params
        } = ZodDuplicatSpaceByIDURLParamsSchema.safeParse(req.params);

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

router.post('/duplicate/by-id/:id', asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new DuplicateSpaceByIDHandler();
    return await handler.handle(req, res);
}));

const duplicateSpaceByIDRouter = router;
export default duplicateSpaceByIDRouter;