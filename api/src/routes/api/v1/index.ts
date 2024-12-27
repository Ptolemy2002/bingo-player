import { Router } from "express";
import spacesRouter from "./spaces";

const router = Router();

router.use("/spaces", spacesRouter
    /*
        #swagger.tags = ['Spaces']

        #swagger.responses[400] = {
            description: "Invalid input",
            schema: {
                $ref: "#/components/schemas/ErrorResponse400"
            }
        }
        
        #swagger.responses[404] = {
            description: "No matching spaces found.",
            schema: {
                $ref: "#/components/schemas/ErrorResponse404"
            }
        }

        #swagger.responses[500] = {
            description: "Internal server error.",
            schema: {
                $ref: "#/components/schemas/ErrorResponse"
            }
        }

        #swagger.responses[501] = {
            description: "Not implemented.",
            schema: {
                $ref: "#/components/schemas/ErrorResponse501"
            }
        }
    */
);

const apiRouter = router;
export default apiRouter;