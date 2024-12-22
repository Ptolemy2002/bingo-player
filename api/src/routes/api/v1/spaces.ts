import getEnv from "env";
import { Router } from "express";
import SpaceModel from "models/SpaceModel";
import { GetAllSpacesResponseBody } from "shared";
const router = Router();

router.get<
    // Path
    "/all",
    // URL Parameters
    {},
    // Response body
    GetAllSpacesResponseBody,
    // Request body
    {},
    // Query Parameters
    {}
>('/all', (_, res) => {
    /*
        #swagger.start
        #swagger.path = '/api/v1/spaces/all'
        #swagger.method = 'get'
        #swagger.description = 'Get all spaces in the database.'

        #swagger.responses[200] = {
            description: "Spaces found",
            schema: {
                ok: true,
                spaces: [
                    { $ref: "#/definitions/CleanMongoSpace" }
                ],
                help: "https://example.com/docs"
            }
        }

        #swagger.responses[404] = {
            description: "No matching spaces found.",
            schema: {
                $ref: "#/definitions/ErrorResponse"
            },

            examples: {
                "application/json": {
                    ok: false,
                    code: "NOT_FOUND",
                    message: "No matching spaces found.",
                    help: "https://example.com/docs"
                }
            }
        }
        #swagger.end
    */
    const env = getEnv();
    const help = env.apiURL + "/api/v1/docs/#/Spaces/get_api_v1_spaces_all";

    SpaceModel.find({}).then(spaces => {
        if (spaces.length === 0) {
            res.status(404).send({
                ok: false,
                code: "NOT_FOUND",
                message: "No matching spaces found.",
                help
            });
            return;
        }

        res.send({
            ok: true,
            spaces: spaces.map(
                s => ({
                    ...s.toJSON(),
                    _id: s._id.toString()
                })
            ),
            help
        });
    });
});

const spacesRouter = router;
export default spacesRouter;