import { Validity } from "./Validity";

/**
 * Pairs a value with a validity.
 */
export interface ValidatedValue<T> {
  value: T;
  validity: Validity;
}
