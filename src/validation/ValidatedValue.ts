import { ValidationError } from "./ValidationError";
import { Validity } from "./Validity";

/**
 * Pairs a value with a validity.
 */
export interface ValidatedValue<T, E extends ValidationError> {
  value: T;
  validity: Validity<E>;
}
