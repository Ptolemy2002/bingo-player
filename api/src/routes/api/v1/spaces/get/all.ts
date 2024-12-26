import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import { interpretZodError } from "@ptolemy2002/regex-utils";
import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { GetSpacesQueryParams, GetSpacesResponseBody, ZodGetSpacesQueryParamsSchema } from "shared";

const router = Router();

export async function getAllSpaces({limit, offset}: GetSpacesQueryParams = {}) {
    let query = SpaceModel.find({});
    if (limit) query = query.limit(limit);
    if (offset) query = query.skip(offset);
    return query.exec();
}

router.get<
    // Path
    "/get/all",
    // URL Parameters
    {},
    // Response body
    GetSpacesResponseBody,
    // Request body
    {},
    // Query Parameters
    GetSpacesQueryParams
>('/get/all', asyncErrorHandler(async (req, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all'
        #swagger.method = 'get'
        #swagger.description = 'Get all spaces in the database.'

        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Maximum number of spaces to return.',
            required: false,
            type: 'number'
        }

        #swagger.parameters['offset'] = {
            in: 'query',
            description: 'Number of spaces to skip. Default is 0.',
            required: false,
            type: 'number'
        }

        #swagger.responses[200] = {
            schema: {
                $ref: "#/components/schemas/GetSpaces200ResponseBody"
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_all";

    const {success, error, data: query} = ZodGetSpacesQueryParamsSchema.safeParse(req.query);

    if (!success) {
        res.status(400).json({
            ok: false,
            code: "BAD_QUERY",
            message: interpretZodError(error),
            help
        });
        return;
    }

    const spaces = await getAllSpaces(query);
    if (spaces.length === 0) {
        res.status(404).json({
            ok: false,
            code: "NOT_FOUND",
            message: "No matching spaces found.",
            help
        });
        return;
    }

    res.json({
        ok: true,
        spaces: spaces.map(s => s.toClientJSON()),
        help
    });
}));

const getAllSpacesRouter = router;
export default getAllSpacesRouter;