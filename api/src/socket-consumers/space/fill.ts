import SocketRouteHandler, { SocketRouteHandlerRequestData } from "lib/SocketRouteHandler";
import SpaceModel from "models/SpaceModel";
import { SocketConsumer } from "services/socket";
import { ZodSocketSpaceFillArgsSchema, SocketSpaceFillEventName, SocketSpaceFillSuccessResponse, BingoGameCollection, cleanMongoSpace } from "shared";

export class BingoSpaceFillHandler extends SocketRouteHandler<SocketSpaceFillSuccessResponse> {
    constructor() {
        super(SocketSpaceFillEventName);
    }

    async generateResponse(req: SocketRouteHandlerRequestData) {
        const { success: argsSuccess, data: args, error: argsError} = ZodSocketSpaceFillArgsSchema.safeParse(req.args);

        if (!argsSuccess) {
            return {
                status: 400,
                response: this.buildZodErrorResponse(argsError, "BAD_INPUT", {
                    prefix: "args"
                })
            };
        }

        const { gameId, maxSpaces, condition } = args;

        if (!BingoGameCollection.global.hasGame(gameId)) {
            return {
                status: 404,
                response: this.buildNotFoundResponse(`Game with ID "${gameId}" does not exist`)
            };
        }

        const game = BingoGameCollection.global.getGame(gameId)!;
        const player = game.getPlayerBySocketId(req.id);

        if (!player) {
            return {
                status: 403,
                response: this.buildErrorResponse("FORBIDDEN", "Only players currently in the game can fill spaces")
            };
        }

        if (player.role === "spectator") {
            return {
                status: 403,
                response: this.buildErrorResponse("FORBIDDEN", "Spectators are not allowed to fill spaces")
            };
        }

        const spacesToAdd = await game.fetchSpacesBasedOnCondition(
            condition,
            maxSpaces,
            async (includedTags, excludedTags, excludedIds, count) => {
                const spaces = await SpaceModel.executeDocumentAggregation([
                    {
                        $match: {
                            _id: { $nin: excludedIds },
                            $and: [
                                { tags: { $in: includedTags } },
                                { tags: { $nin: excludedTags } }
                            ]
                        }
                    },
                    { $sample: { size: count } }
                ]);

                const res = spaces.map(SpaceModel.normalizeMongoDocumentSpace);
                console.log(`Fetched ${res.length} spaces from database for filling (requested ${count})`, includedTags, excludedTags, excludedIds);

                // We aren't throwing an error if we don't get enough spaces back because the variable
                // is a maximum number of spaces to fill, not a required number.
                return res;
            }
        );

        const prevGameState = game.toJSON();

        // Necessary because if an error occurs midway through processing the space filling, we should
        // act as if the entire operation never happened to avoid side effects
        function revertGameState() {
            return game.fromJSON(prevGameState);
        }

        try {
            for (const space of spacesToAdd) {
                game.addSpace(space);
                if (space.tags?.includes("literally-free")) game.mark(space._id);
            }
            
            req.socket.to(game.getSocketRoomName()).emit("spacesChange", { op: "add", spaces: spacesToAdd.map(cleanMongoSpace), gameId });
        } catch (e) {
            // This should be a RouteError, which can be rethrown and handled by the root level error handler
            // If it's not, the handler will find what it can from the error object and report it back to the client
            revertGameState();
            throw e;
        }

        return {
            status: 200,
            response: this.buildSuccessResponse({
                filledSpacesCount: spacesToAdd.length,
                game: game.toJSON()
            })
        };
    }
}

const spaceFillSocketConsumer: SocketConsumer = (socket, io) => {
    const handler = new BingoSpaceFillHandler();

    socket.on(SocketSpaceFillEventName, async (args, callback) => {
        await handler.handle(socket, io, args, callback);
    });
};

export default spaceFillSocketConsumer;