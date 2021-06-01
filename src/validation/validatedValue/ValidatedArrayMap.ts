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

/**
 * Expresses the relationship between an array value and its child values.
 */
export type ValidatedArrayMap<T> = {
  [key in number]: ValidatedValue<T>;
};

/**
 * A ValueExtractor function that pulls children from an array of form values by index.
 */
export const extractArrayChild = <T>(
  arrayValue: ValidatedValue<T[]> | undefined,
  index: number,
) =>
  arrayValue && {
    value: arrayValue.value[index],
    validity: extractArrayChildValidity(arrayValue, index),
  };
/** Simply returns `extractArrayChild`, but provides a better generic type */
export function getExtractArrayChild<T>(): ValueExtractor<
  ValidatedValue<T[]>,
  ValidatedArrayMap<T>
> {
  return extractArrayChild;
}

/**
 * A ValueRecombiner function that places a child value into the array value by index.
 */
export const recombineArrayChild = <T>(
  prevArrayValue: ValidatedValue<T[]> | undefined,
  nextChildValue: ValidatedValue<T>,
  index: number,
) => {
  const nextArrayValue = prevArrayValue ? [...prevArrayValue.value] : [];
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
export function getRecombineArrayChild<T>(): ValueRecombiner<
  ValidatedValue<T[]>,
  ValidatedArrayMap<T>
> {
  return recombineArrayChild;
}

function extractArrayChildValidity<T>(
  arrayValue: ValidatedValue<T[]>,
  index: number,
): Validity {
  return mapValidity(arrayValue.validity, (arrayError: FormControlError) =>
    arrayError.variant === "array" ? arrayError.innerErrors[index] : undefined,
  );
}

function updateArrayValidity(
  currentOuterValidity: Validity | undefined,
  nextItemValidity: Validity,
  index: number,
): Validity {
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
