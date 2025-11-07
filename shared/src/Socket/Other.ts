export const SocketSpaceOpEnum = [
    "mark",
    "unmark",
    "toggleMark",
    "add",
    "remove"
] as const;

export const SocketPlayersChangeTypeEnum = [
    "join",
    "leave",
    "disconnect",
    "nameChange"
] as const;

export const SocketBoardsChangeTypeEnum = [
    "add",
    "remove",
    "update"
] as const;