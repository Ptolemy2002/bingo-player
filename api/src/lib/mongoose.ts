import { isZodError, interpretZodError } from "@ptolemy2002/zod-utils";
import { Error } from "mongoose";

export function interpretValidationError(e: Error.ValidationError): string | string[] {
    const messages = Object.entries(e.errors).map(([key, err]) => {
        if (isZodError(err.reason)) return interpretZodError(err.reason, key);
        return `${key}: ${err.message}`;
    });

    return messages.length === 1 ? messages[0] : messages;
}