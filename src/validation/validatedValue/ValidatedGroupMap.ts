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

export type ValidatedGroupMap<T extends Record<string, any>> = {
  [key in keyof T & string]: ValidatedValue<T[key]>;
};

export const extractGroupChild = <T, K extends keyof ValidatedGroupMap<T>>(
  groupValue: ValidatedValue<T>,
  key: K,
) => ({
  value: groupValue.value[key],
  validity: extractGroupChildValidity(groupValue, key),
});
export function getExtractGroupChild<T>(): ValueExtractor<
  ValidatedValue<T>,
  ValidatedGroupMap<T>
> {
  return extractGroupChild;
}

export const recombineGroupChild = <T, K extends keyof ValidatedGroupMap<T>>(
  prevGroupValue: ValidatedValue<T>,
  nextChildValue: ValidatedValue<T[K]>,
  key: K,
) => ({
  value: {
    ...prevGroupValue.value,
    [key]: nextChildValue.value,
  },
  validity: updateGroupValidity<T>(
    prevGroupValue.validity,
    nextChildValue.validity,
    key,
  ),
});
export function getRecombineGroupChild<T>(): ValueRecombiner<
  ValidatedValue<T>,
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
  currentOuterValidity: Validity,
  nextItemValidity: Validity,
  innerName: keyof T & string,
): Validity {
  const currentOuterError = validityError(currentOuterValidity);
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
