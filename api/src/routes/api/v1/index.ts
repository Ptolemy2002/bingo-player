import { Router } from "express";
import spacesRouter from "./spaces";

const router = Router();

router.use("/spaces", spacesRouter
    /*
        #swagger.tags = ['Spaces']

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
        
        #swagger.responses[404] = {
            description: "No matching spaces found.",
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ErrorResponse"
                    },

                    example: {
                        ok: false,
                        code: "NOT_FOUND",
                        message: "No matching spaces found.",
                        help: "http://example.com/docs"
                    }
                }
            }
        }

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

const apiRouter = router;
export default apiRouter;