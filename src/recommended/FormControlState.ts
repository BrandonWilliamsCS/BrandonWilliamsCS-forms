import { Validity, validValidity } from "../validation";

/**
 * Represents the form-relevant state details belonging to a control.
 */
export interface FormControlState<T> {
  value: T;
  validity: Validity;
}

export function initialFormControlState<T>(
  initialValue: T,
): FormControlState<T>;
export function initialFormControlState<T>(): FormControlState<T | undefined>;
export function initialFormControlState<T>(
  initialValue?: T,
): FormControlState<T | undefined> {
  return {
    value: initialValue,
    // We don't yet know if the initial value is valid.
    // In the absence of an "unknown" option, "no known errors" => "valid".
    validity: validValidity,
  };
}
