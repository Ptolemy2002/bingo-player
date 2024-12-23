import express from 'express';
import indexRoutes from './routes';
const router = express.Router();

router.use("/", indexRoutes
    /*
        This comment will automatically add all the specified properties to the routes
        defined in the indexRoutes file for documentation.

        #swagger.responses[500] = {
            description: "Internal server error.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    }
                }
            }
        }

        #swagger.responses[501] = {
            description: "Not implemented.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    },

                    example: {
                        ok: false,
                        code: "NOT_IMPLEMENTED",
                        message: "This feature is not yet implemented.",
                        help: "https://example.com/docs"
                    }
                }
            }
        }
    */
);

const indexRouter = router;
export default indexRouter;