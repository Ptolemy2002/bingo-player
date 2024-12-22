import express from 'express';
import indexRoutes from './routes';
const router = express.Router();

router.use("/", indexRoutes
    /*
        This comment will automatically add all the specified properties to the routes
        defined in the indexRoutes file for documentation.

        #swagger.responses[500] = {
            description: "Internal server error.",
            schema: {
                $ref: "#/definitions/ErrorResponse"
            }
        }
    */
);

const indexRouter = router;
export default indexRouter;