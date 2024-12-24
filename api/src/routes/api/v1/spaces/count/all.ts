import { asyncErrorHandler } from "@ptolemy2002/express-utils";
import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { CountSpacesResponseBody } from "shared";

const router = Router();

export async function countAllSpaces() {
    const count = await SpaceModel.countDocuments({});
    return count;
}

router.get<
    // Path
    "/count/all",
    // URL Parameters
    {},
    // Response body
    CountSpacesResponseBody,
    // Request body
    {},
    // Query Parameters
    {}
>('/count/all', asyncErrorHandler(async (_, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/count/all'
        #swagger.method = 'get'
        #swagger.description = 'Get the number of spaces in the database.'

        #swagger.responses[200] = {
            description: "Number of spaces found",
            schema: {
                $ok: true,
                $count: 42,
                help: "https://example.com/docs"
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_count_all";

    const count = await countAllSpaces();

    if (count === 0) {
        res.status(404).json({
            ok: false,
            code: "NOT_FOUND",
            message: "No spaces found.",
            help
        });
        return;
    }

    res.json({
        ok: true,
        count,
        help
    });
}));

const countAllSpacesRouter = router;
export default countAllSpacesRouter;
