import express from 'express';
const router = express.Router();

// Root route
router.get('/', function(req, res, next) {
    res.send("Root route. For docs, go <a href='/api/v1/docs'>here</a>.");
});

router.get("/ping", (req, res) => {
    /*
        #swagger.tags = ['General']
        
        #swagger.description = `
            Ping the server to ensure the API is up and running.
            It should respond with a 200 response and the text "pong".
        `

        #swagger.responses[200] = {
            description: "Server is up and running.",
            schema: "pong"
        }
    */
    res.send("pong");
});

type User = {
    id: number;
};
// Allow POST with a user as the body
router.post<
    // Route path
    "/user",
    // Parameters
    {},
    // Response body
    {ok: true, user: User},
    // Request body
    User,
    // Query Parameters
    {}
>("/user", (req, res) => {
    /*
        We have to manually add the Swagger annotations here because autogen
        doesn't recognize the TypeScript syntax for the route handler.

        #swagger.start

        #swagger.path = '/user'
        #swagger.method = 'post'
        #swagger.tags = ['User']
        #swagger.description = 'Create a new user.'

        #swagger.parameters['user'] = {
            in: 'body',
            description: 'User object',
            required: true,
            schema: {
                $ref: '#/definitions/User'
            }
        }

        #swagger.responses[201] = {
            description: 'User created successfully.',
            schema: {
                ok: true,
                user: {
                    $ref: '#/definitions/User'
                }
            }
        }

        #swagger.end
    */
    res.status(201).send({ok: true, user: req.body});
});

const indexRoutes = router;
export default indexRoutes;