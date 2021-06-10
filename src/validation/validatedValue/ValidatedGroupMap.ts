import { ValueExtractor, ValueRecombiner } from "../../control";
import {
  addGroupedError,
  FormControlError,
  mapValidity,
  Validity,
  validityError,
  validityFor,
} from "..";
import { ValidatedValue } from "../ValidatedValue";
import { ValidationError } from "../ValidationError";

/**
 * Expresses the relationship between a group value and its child values (by key).
 */
export type ValidatedGroupMap<
  T extends Record<string, any>,
  E extends ValidationError,
> = {
  [key in keyof T & string]: ValidatedValue<T[key], E>;
};

/**
 * A ValueExtractor function that pulls children from a group/object of form objects by key.
 */
export const extractGroupChild = <
  T,
  K extends keyof ValidatedGroupMap<T, E>,
  E extends ValidationError,
>(
  groupValue: ValidatedValue<Partial<T>, E> | undefined,
  key: K,
) =>
  groupValue && key in groupValue.value
    ? {
        // This is technically `Partial<T>`, but we just confirmed that at least
        // this key is present and can is "enough of" a `T` for our needs.
        value: (groupValue.value as T)[key],
        validity: extractGroupChildValidity(groupValue, key),
      }
    : undefined;
/** Simply returns `extractGroupChild`, but provides a better generic type */
export function getExtractGroupChild<
  T,
  E extends ValidationError,
>(): ValueExtractor<ValidatedValue<Partial<T>, E>, ValidatedGroupMap<T, E>> {
  return extractGroupChild;
}

/**
 * A ValueRecombiner function that places a child value into the group value by key.
 */
export const recombineGroupChild = <
  T,
  K extends keyof ValidatedGroupMap<T, E>,
  E extends ValidationError,
>(
  prevGroupValue: ValidatedValue<Partial<T>, E> | undefined,
  nextChildValue: ValidatedValue<T[K], E>,
  key: K,
) => ({
  value: {
    ...prevGroupValue?.value,
    [key]: nextChildValue.value,
  },
  validity: updateGroupValidity<T, E>(
    prevGroupValue?.validity,
    nextChildValue.validity,
    key,
  ),
});
/** Simply returns `recombineGroupChild`, but provides a better generic type */
export function getRecombineGroupChild<
  T,
  E extends ValidationError,
>(): ValueRecombiner<ValidatedValue<Partial<T>, E>, ValidatedGroupMap<T, E>> {
  return recombineGroupChild;
}

function extractGroupChildValidity<
  T,
  K extends keyof T & string,
  E extends ValidationError,
>(groupValue: ValidatedValue<T, E>, key: K): Validity<E> {
  return mapValidity(groupValue.validity, (groupError: FormControlError<E>) =>
    groupError.variant === "group" ? groupError.innerErrors[key] : undefined,
  );
}

function updateGroupValidity<
  T extends Record<string, any>,
  E extends ValidationError,
>(
  currentOuterValidity: Validity<E> | undefined,
  nextItemValidity: Validity<E>,
  innerName: keyof T & string,
): Validity<E> {
  const currentOuterError =
    currentOuterValidity && validityError(currentOuterValidity);
  // In the buggy case that the validity doesn't fit a group, just ditch the error.
  const currentGroupError =
    currentOuterError?.variant === "group" ? currentOuterError : undefined;
  const nextItemError = nextItemValidity.isValid
    ? undefined
    : nextItemValidity.error;
  const newGroupError = addGroupedError(
    currentGroupError,
    nextItemError,
    innerName,
  );
  return validityFor(newGroupError);
}
