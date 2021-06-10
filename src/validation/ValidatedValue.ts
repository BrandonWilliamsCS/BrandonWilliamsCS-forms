import { Validity } from "./Validity";

/**
 * Pairs a value with a validity.
 */
export interface ValidatedValue<T, E> {
  value: T;
  validity: Validity<E>;
}
