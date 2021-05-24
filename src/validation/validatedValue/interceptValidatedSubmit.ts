import { Handler } from "../../utility";
import { ValidatedValue } from "../ValidatedValue";

export function interceptValidatedSubmit<TRaw, TFinal>(
  controlState: ValidatedValue<TRaw>,
  onValidSubmit: Handler<TFinal>,
): void {
  if (controlState.validity.isValid) {
    // Trust that `isValid` implies the value is really TFinal.
    return onValidSubmit(controlState.value as unknown as TFinal);
  }
}
