import { ValidatedValue } from "../ValidatedValue";
import { validValidity } from "../Validity";

export function initialValidatedValue<T>(initialValue: T): ValidatedValue<T>;
export function initialValidatedValue<T>(): ValidatedValue<T | undefined>;
export function initialValidatedValue<T>(
  initialValue?: T,
): ValidatedValue<T | undefined> {
  return {
    value: initialValue,
    // We don't yet know if the initial value is valid.
    // In the absence of an "unknown" option, "no known errors" => "valid".
    validity: validValidity,
  };
}
