import {
  addArrayedError,
  FormControlError,
  mapValidity,
  Validity,
  validityError,
  validityFor,
} from "..";
import { ValueExtractor, ValueRecombiner } from "../../control";
import { ValidatedValue } from "../ValidatedValue";
import { ValidationError } from "../ValidationError";

/**
 * Expresses the relationship between an array value and its child values.
 */
export type ValidatedArrayMap<T, E extends ValidationError> = {
  [key in number]: ValidatedValue<T, E>;
};

/**
 * A ValueExtractor function that pulls children from an array of form values by index.
 */
export const extractArrayChild = <T, E extends ValidationError>(
  arrayValue: ValidatedValue<T[], E> | undefined,
  index: number,
) =>
  arrayValue && index in arrayValue.value
    ? {
        value: arrayValue.value[index],
        validity: extractArrayChildValidity(arrayValue, index),
      }
    : undefined;
/** Simply returns `extractArrayChild`, but provides a better generic type */
export function getExtractArrayChild<
  T,
  E extends ValidationError,
>(): ValueExtractor<ValidatedValue<T[], E>, ValidatedArrayMap<T, E>> {
  return extractArrayChild;
}

/**
 * A ValueRecombiner function that places a child value into the array value by index.
 */
export const recombineArrayChild = <T, E extends ValidationError>(
  prevArrayValue: ValidatedValue<T[], E> | undefined,
  nextChildValue: ValidatedValue<T, E>,
  index: number,
) => {
  const nextArrayValue = prevArrayValue ? cloneArray(prevArrayValue.value) : [];
  nextArrayValue[index] = nextChildValue.value;
  return {
    value: nextArrayValue,
    validity: updateArrayValidity(
      prevArrayValue?.validity,
      nextChildValue.validity,
      index,
    ),
  };
};
/** Simply returns `recombineArrayChild`, but provides a better generic type */
export function getRecombineArrayChild<
  T,
  E extends ValidationError,
>(): ValueRecombiner<ValidatedValue<T[], E>, ValidatedArrayMap<T, E>> {
  return recombineArrayChild;
}

function extractArrayChildValidity<T, E extends ValidationError>(
  arrayValue: ValidatedValue<T[], E>,
  index: number,
): Validity<E> {
  return mapValidity(arrayValue.validity, (arrayError: FormControlError<E>) =>
    arrayError.variant === "array" ? arrayError.innerErrors[index] : undefined,
  );
}

function updateArrayValidity<E extends ValidationError>(
  currentOuterValidity: Validity<E> | undefined,
  nextItemValidity: Validity<E>,
  index: number,
): Validity<E> {
  const currentOuterError =
    currentOuterValidity && validityError(currentOuterValidity);
  // In the buggy case that the validity doesn't fit an array, just ditch the error.
  const currentArrayError =
    currentOuterError?.variant === "array" ? currentOuterError : undefined;
  const nextItemError = nextItemValidity.isValid
    ? undefined
    : nextItemValidity.error;
  const newArrayError = addArrayedError(
    currentArrayError,
    nextItemError,
    index,
  );
  return validityFor(newArrayError);
}

function cloneArray<T>(array: T[]): T[] {
  // crucially, this preserves empty slots (rather than filling them with undefined)
  return array.map((x) => x);
}
