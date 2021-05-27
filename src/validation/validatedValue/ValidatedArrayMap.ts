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

export type ValidatedArrayMap<T> = {
  [key in number]: ValidatedValue<T>;
};

export const extractArrayChild = <T>(
  arrayValue: ValidatedValue<T[]>,
  index: number,
) => ({
  value: arrayValue.value[index],
  validity: extractArrayChildValidity(arrayValue, index),
});
export function getExtractArrayChild<T>(): ValueExtractor<
  ValidatedValue<T[]>,
  ValidatedArrayMap<T>
> {
  return extractArrayChild;
}

export const recombineArrayChild = <T>(
  prevArrayValue: ValidatedValue<T[]>,
  nextChildValue: ValidatedValue<T>,
  index: number,
) => {
  const nextArrayValue = [...prevArrayValue.value];
  nextArrayValue[index] = nextChildValue.value;
  return {
    value: nextArrayValue,
    validity: updateArrayValidity<T>(
      prevArrayValue.validity,
      nextChildValue.validity,
      index,
    ),
  };
};
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

function updateArrayValidity<T>(
  currentOuterValidity: Validity,
  nextItemValidity: Validity,
  index: number,
): Validity {
  const currentOuterError = validityError(currentOuterValidity);
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
