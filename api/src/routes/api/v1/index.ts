import { Router } from "express";
import spacesRouter from "./spaces";

const router = Router();

router.use("/spaces", spacesRouter
    /*
        #swagger.tags = ['Spaces']
        
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
                    help: "http://example.com/docs"
                }
            }
        }
    */
);

const apiRouter = router;
export default apiRouter;