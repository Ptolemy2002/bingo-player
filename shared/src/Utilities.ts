import { z } from "zod";

// This is part of @ptolemy2002/regex-utils, but we have to copy it because it's possible
// that object will not support OpenAPI integration.
export const ZodCoercedBooleanEnum = z.enum([
    "true", "false",
    "t", "f",
    "yes", "no",
    "y", "n",
    "1", "0",
    "on", "off"
]);

export const ZodCoercedBoolean = ZodCoercedBooleanEnum.transform((val) => {
  switch (val) {
    case "true":
    case "t":
    case "yes":
    case "y":
    case "1":
    case "on":
      return true;
    case "false":
    case "f":
    case "no":
    case "n":
    case "0":
    case "off":
      return false;
  }
});