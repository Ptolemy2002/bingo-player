import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { interpretZodError } from "@ptolemy2002/regex-utils";
import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
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
        
        #swagger.responses[400] = {
            description: "Invalid input",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    },

                    example: {
                        ok: false,
                        code: "BAD_INPUT",
                        message: "Invalid input.",
                        help: "https://example.com/docs"
                    }
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
            message: interpretZodError(error),
            help
        });
        return;
    }

    const { prop } = params;
    let values: (string | null)[] = [];

    switch(prop) {
        case "id": {
            const _values = await SpaceModel.distinct("_id").exec();
            values = _values.map(String);
            break;
        }
        
        case "_id":
        case "name":
        case "description":
        case "examples":
        case "aliases":
        case "tags":{
            const _values = await SpaceModel.distinct(prop).exec();
            values = _values.map((v) => {
                if (v === null) {
                    return null;
                }
                return String(v);
            });
            break;
        }

        case "alias": {
            const _values = await SpaceModel.distinct("aliases").exec();
            values = _values;
            break;
        }

        case "tag": {
            const _values = await SpaceModel.distinct("tags").exec();
            values = _values;
            break;
        }

        case "example": {
            const _values = await SpaceModel.distinct("examples").exec();
            values = _values;
            break;
        }

        case "known-as": {
            // Aliases and names
            const names = await SpaceModel.distinct("name").exec();
            const aliases = await SpaceModel.distinct("aliases").exec();
            values = [...new Set([...names, ...aliases])];
            break;
        }

        default: {
            console.error(`Unrecognized SpaceQueryProp: ${prop}`);
            res.status(501).json({
                ok: false,
                code: "NOT_IMPLEMENTED",
                message: "Not implemented",
                help
            });
            return;
        }
    }

    res.json({
        ok: true,
        values,
        help
    });
}));

const listAllSpacePropValuesRouter = router;
export default listAllSpacePropValuesRouter;