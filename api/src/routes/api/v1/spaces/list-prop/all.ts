import getEnv from "env";
import { Router } from "express";
import { ListPropParams, ListPropResponseBody, ZodListPropParamsSchema } from "shared";

const router = Router();

router.get<
    // Path
    "/get/all/list/:prop",
    // URL Parameters
    ListPropParams,
    // Response body
    ListPropResponseBody,
    // Request body
    {},
    // Query Parameters
    {}
>('/get/all/list/:prop', (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all/list/{prop}'
        #swagger.method = 'get'
        #swagger.description = 'Get all values for a given space query prop.'
        #swagger.parameters['prop'] = {
            in: 'path',
            description: 'The space query prop to list.',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: "List of values found",
            schema: {
                ok: true,
                values: ["value1", "value2"],
                help: "https://example.com/docs"
            }
        }
        
        #swagger.responses[400] = {
            description: "Invalid input",
            schema: {
                $ref: "#/definitions/ErrorResponse"
            },
            examples: {
                "application/json": {
                    ok: false,
                    code: "BAD_INPUT",
                    message: "Invalid space query prop",
                    help: "https://example.com/docs"
                }
            }
        }
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_all_list__prop_";

    const { success, error, data: params } = ZodListPropParamsSchema.safeParse(req.params);
    if (!success) {
        res.status(400).json({
            ok: false,
            code: "BAD_INPUT",
            message: error.message,
            help
        });
        return;
    }

    res.status(501).json({
        ok: false,
        code: "NOT_IMPLEMENTED",
        message: "Not implemented",
        help
    });
});

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;