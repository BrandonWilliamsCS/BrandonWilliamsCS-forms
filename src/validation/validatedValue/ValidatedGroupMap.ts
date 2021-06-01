import {
  addGroupedError,
  FormControlError,
  mapValidity,
  Validity,
  validityError,
  validityFor,
} from "..";
import { ValueExtractor, ValueRecombiner } from "../../control";
import { ValidatedValue } from "../ValidatedValue";

/**
 * Expresses the relationship between a group value and its child values (by key).
 */
export type ValidatedGroupMap<T extends Record<string, any>> = {
  [key in keyof T & string]: ValidatedValue<T[key]>;
};

/**
 * A ValueExtractor function that pulls children from a group/object of form objects by key.
 */
export const extractGroupChild = <T, K extends keyof ValidatedGroupMap<T>>(
  groupValue: ValidatedValue<Partial<T>> | undefined,
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
export function getExtractGroupChild<T>(): ValueExtractor<
  ValidatedValue<Partial<T>>,
  ValidatedGroupMap<T>
> {
  return extractGroupChild;
}

/**
 * A ValueRecombiner function that places a child value into the group value by key.
 */
export const recombineGroupChild = <T, K extends keyof ValidatedGroupMap<T>>(
  prevGroupValue: ValidatedValue<Partial<T>> | undefined,
  nextChildValue: ValidatedValue<T[K]>,
  key: K,
) => ({
  value: {
    ...prevGroupValue?.value,
    [key]: nextChildValue.value,
  },
  validity: updateGroupValidity<T>(
    prevGroupValue?.validity,
    nextChildValue.validity,
    key,
  ),
});
/** Simply returns `recombineGroupChild`, but provides a better generic type */
export function getRecombineGroupChild<T>(): ValueRecombiner<
  ValidatedValue<Partial<T>>,
  ValidatedGroupMap<T>
> {
  return recombineGroupChild;
}

function extractGroupChildValidity<T, K extends keyof T & string>(
  groupValue: ValidatedValue<T>,
  key: K,
): Validity {
  return mapValidity(groupValue.validity, (groupError: FormControlError) =>
    groupError.variant === "group" ? groupError.innerErrors[key] : undefined,
  );
}

function updateGroupValidity<T extends Record<string, any>>(
  currentOuterValidity: Validity | undefined,
  nextItemValidity: Validity,
  innerName: keyof T & string,
): Validity {
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
