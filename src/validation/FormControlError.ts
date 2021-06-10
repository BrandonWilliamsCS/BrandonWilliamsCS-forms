import { isArrayHollow } from "../utility/isArrayHollow";
import { isObjectHollow } from "../utility/isObjectHollow";
import { ValidationError } from "./ValidationError";

/**
 * Represents error within some abstracted form control. The control - or, more
 * precisely, the errors attached to it - may be a simple "field", a "group" of
 * errors keyed by string, or an "array" of errors keyed by number.
 */
export type FormControlError<E extends ValidationError> =
  | FieldError<E>
  | GroupError<E>
  | ArrayError<E>;

/**
 * Represents a simple "field"-style error in a form control. It has no inner
 * element errors, but only has a flat array of errors that apply directly to
 * it.
 */
export interface FieldError<E extends ValidationError> {
  readonly variant: "field";
  readonly errors: E[];
}

/**
 * Represents a string-keyed "group" of inner errors for a control. The base
 * control may have its own, flat array of errors, but a group error also
 * represents logical child/inner errors in an object shape.
 */
export interface GroupError<E extends ValidationError> {
  readonly variant: "group";
  readonly errors: E[];
  readonly innerErrors: Record<string, FormControlError<E> | undefined>;
}

/**
 * Represents a number-keyed "array" of inner errors for a control. The base
 * control may have its own, flat array of errors, but an array error also
 * represents logical child/inner errors in an array shape.
 */
export interface ArrayError<E extends ValidationError> {
  readonly variant: "array";
  readonly errors: E[];
  readonly innerErrors: Array<FormControlError<E> | undefined>;
}

/**
 * Adjusts a group error so that it includes a particular error within its item error group.
 * @param currentGroupError a base group error that should be adjusted to include the next item error
 * @param nextItemError an error for one item within the group
 * @param itemName the name (key) of the item that should receive the next error
 * @returns a new group error that contains the provided item error
 */
export function addGroupedError<
  T extends Record<string, any>,
  E extends ValidationError,
>(
  currentGroupError: GroupError<E> | undefined,
  nextItemError: FormControlError<E> | undefined,
  itemName: keyof T & string,
): GroupError<E> | undefined {
  const nextInnerErrors = currentGroupError
    ? { ...currentGroupError.innerErrors }
    : {};
  nextInnerErrors[itemName] = nextItemError;
  const currentTopLevelErrors = currentGroupError
    ? currentGroupError.errors
    : [];
  // Enforce that GroupErrors with no actual errors should be `undefined` instead.
  return isObjectHollow(nextInnerErrors) && currentTopLevelErrors.length === 0
    ? undefined
    : {
        variant: "group",
        errors: currentTopLevelErrors,
        innerErrors: nextInnerErrors,
      };
}

/**
 * Adjusts an array error so that it includes a particular error within its item error array.
 * @param currentArrayError a base array error that should be adjusted to include the next item error
 * @param nextItemError an error for one item within the array
 * @param itemName the index (key) of the item that should receive the next error
 * @returns a new array error that contains the provided item error
 */
export function addArrayedError<E extends ValidationError>(
  currentArrayError: ArrayError<E> | undefined,
  nextItemError: FormControlError<E> | undefined,
  index: number,
): ArrayError<E> | undefined {
  const nextInnerErrors = currentArrayError
    ? [...currentArrayError.innerErrors]
    : [];
  // Make sure there are entries (which might not be errors) up through the new item.
  while (nextInnerErrors.length < index + 1) {
    nextInnerErrors.push(undefined);
  }
  // So that we can set this item without awkward gaps in the array.
  nextInnerErrors[index] = nextItemError;

  const currentTopLevelErrors = currentArrayError
    ? currentArrayError.errors
    : [];

  // Enforce that ArrayErrors with no actual errors should be `undefined` instead.
  return isArrayHollow(nextInnerErrors) && currentTopLevelErrors.length === 0
    ? undefined
    : {
        variant: "array",
        errors: currentTopLevelErrors,
        innerErrors: nextInnerErrors,
      };
}
