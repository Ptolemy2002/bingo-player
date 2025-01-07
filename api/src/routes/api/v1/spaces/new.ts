import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { Router } from "express";
import RouteHandler, { RouteHandlerRequest } from "lib/RouteHandler";
import SpaceModel from "models/SpaceModel";
import { NewSpace200ResponseBody, ZodNewSpaceRequestBodySchema } from "shared";

const router = Router();

export class NewSpaceHandler extends RouteHandler<NewSpace200ResponseBody> {
    /*
        #swagger.start
        #swagger.tags = ['Spaces', 'New']
        #swagger.path = '/api/v1/spaces/new'
        #swagger.method = 'post'
        #swagger.description = 'Create a new space in the database.'

        #swagger.requestBody = {
            required: true,
            schema: {
                $ref: "#/components/schemas/NewSpaceRequestBody"
            }
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/NewSpace200ResponseBody"
            }
        }
        #swagger.end
    */
    constructor() {
        super(1, '/#/Spaces/post_api_v1_spaces_new');
    }

    async generateResponse(req: RouteHandlerRequest) {
        const { success: bodySuccess, error: bodyError, data: body } = ZodNewSpaceRequestBodySchema.safeParse(req.body);

        if (!bodySuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(bodyError, "BAD_BODY")
            };
        }

        // Create a new space
        const space = await SpaceModel.create(body.space);
        await space.makeNameUnique();

        return {
            status: 200,
            response: this.buildSuccessResponse({
                space: space.toClientJSON()
            })
        };
    }
}

router.post("/new", asyncErrorHandler(async (req, res) => {
    // #swagger.ignore = true
    const handler = new NewSpaceHandler();
    return await handler.handle(req, res);
}));

const newSpaceRouter = router;
export default newSpaceRouter;