import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { interpretZodError } from "@ptolemy2002/regex-utils";
import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { interpretSpaceQueryProp, ListPropParams, ListPropResponseBody, SpaceQueryProp, ZodListPropParamsSchema } from "shared";

const router = Router();

export async function listAllSpacePropValues(prop: SpaceQueryProp): Promise<(string | null)[]> {
    prop = interpretSpaceQueryProp(prop);

    if (prop === "known-as") {
        // Aliases and names
        const names = await listAllSpacePropValues("name");
        const aliases = await listAllSpacePropValues("aliases");
        return [...new Set([...names, ...aliases])];
    }

    const values = await SpaceModel.distinct(prop).exec();
    return values.map((v) => {
        if (v === null) {
            return null;
        }
        return String(v);
    });
}

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
>('/get/all/list/:prop', asyncErrorHandler(async (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all/list/{prop}'
        #swagger.method = 'get'
        #swagger.description = `
            Get all values for a given space query prop.
            The values are returned as an array of strings, but may contain null values.
        `
        #swagger.parameters['prop'] = {
            in: 'path',
            description: 'The space query prop to list.',
            required: true,
            type: 'string',
            schema: {
                $ref: "#/components/schemas/SpaceQueryProp"
            }
        }
        #swagger.responses[200] = {
            description: "List of values found",
            schema: {
                $ok: true,
                $values: { $ref: "#/components/schemas/NullableStringArray" },
                help: "https://example.com/docs"
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_all_list__prop_";

    const { success, error, data: params } = ZodListPropParamsSchema.safeParse(req.params);
    if (!success) {
        res.status(400).json({
            ok: false,
            code: "BAD_INPUT",
            message: interpretZodError(error),
            help
        });
        return;
    }

    const { prop } = params;
    res.json({
        ok: true,
        values: await listAllSpacePropValues(prop),
        help
    });
}));

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;