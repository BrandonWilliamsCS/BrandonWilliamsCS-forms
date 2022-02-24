import { Validity } from "../value";
import { FormControlError } from "./FormControlError";

export function getFieldErrorMessage<E>(
  validity: Validity<FormControlError<E>>,
  messageResolver: (error: E) => string | undefined,
): string | undefined {
  if (validity.isValid) {
    return undefined;
  }

  const allErrors = validity.error.errors;

  for (let error of allErrors) {
    const message = messageResolver(error);
    if (message !== undefined) {
      return message;
    }
  }
  return undefined;
}
