import { Handler } from "../../utility";
import { ValidatedValue } from "../ValidatedValue";
import { ValidationError } from "../ValidationError";

/**
 * Intercepts a submit handler to add validation checks.
 * @param value the form value that may be submitted
 * @param onValidSubmit initiates a confirmed/validated submit
 */
export function interceptValidatedSubmit<
  TRaw,
  TFinal,
  E extends ValidationError,
>(
  value: ValidatedValue<TRaw, E> | undefined,
  onValidSubmit: Handler<TFinal>,
): void {
  if (value?.validity.isValid) {
    // Trust that `isValid` implies the value is really TFinal.
    return onValidSubmit(value.value as unknown as TFinal);
  }
}
