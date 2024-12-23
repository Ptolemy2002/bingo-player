import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { GetSpacesResponseBody } from "shared";

const router = Router();

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
    {}
>('/get/all', (_, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/get/all'
        #swagger.method = 'get'
        #swagger.description = 'Get all spaces in the database.'

        #swagger.responses[200] = {
            description: "Spaces found",
            content: {
                "application/json": {
                    schema: {
                        $ok: true,
                        $spaces: [
                            { $ref: "#/definitions/CleanMongoSpace" }
                        ],
                        help: "https://example.com/docs"
                    },

                    example: {
                        ok: true,
                        spaces: [
                            {
                                _id: "abc123",
                                name: "My Space",
                                description: "This is a space",
                                examples: ["Example 1", "Example 2"],
                                aliases: ["Alias 1", "Alias 2"],
                                tags: ["tag-1", "tag-2"]
                            }
                        ],
                        help: "https://example.com/docs"
                    }
                }
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.getDocsURL(1) + "/#/Spaces/get_api_v1_spaces_get_all";

    SpaceModel.find({}).then(spaces => {
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
    });
});

const getAllSpacesRouter = router;
export default getAllSpacesRouter;