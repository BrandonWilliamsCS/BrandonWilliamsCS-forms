import { ValidationError } from "../../primary";
import { FieldError } from "../FormControlError";

export function testFieldError(type: string): FieldError<ValidationError> {
  return {
    variant: "field",
    errors: [{ type, requiresConfirmation: false }],
  };
}
