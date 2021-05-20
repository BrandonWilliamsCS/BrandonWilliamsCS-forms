import { Handler } from "../utility";
import { FormControlState } from "./FormControlState";

export function interceptValidatedSubmit<TRaw, TFinal>(
  controlState: FormControlState<TRaw>,
  onValidSubmit: Handler<TFinal>,
): void {
  if (controlState.validity.isValid) {
    // Trust that `isValid` implies the value is really TFinal.
    return onValidSubmit(controlState.value as unknown as TFinal);
  }
}
