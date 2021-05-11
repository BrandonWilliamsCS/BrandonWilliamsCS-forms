import { Handler } from "../utility/Handler";
import { Mapper } from "../utility/Mapper";
import { facilitateIterativeChanges } from "./facilitateIterativeChanges";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Enables translation of a FormControl into logical children based on a dynamic key.
 *
 * @remarks
 * Note that `TMap` need not be explicitly related to `TParent`; the children
 *  of `TParent` can be "virtual" in this way. One possible example is a form
 *  that represents `string[]` as a paring of its first element and the rest
 *  of the elements. In this case, `TMap["first"]` would describe a form value
 *  for one string (namely, the first element of the base array) and
 *  `TMap["rest"]` would describe a form value for an array of strings
 *  (namely, all but the) first element of the base array.
 * However, the more closely `TMap` relates to `TParent`, the clearer usage is.
 *
 * @example
 * A simple example covers a `Name` type with string properties `first` and
 *  `last`. The form value for a Name (e.g., FormValue<Name>) may contain more
 *  than just the raw value and so simple indexing is not enough to translate
 *  between a name and its component (first or last) parts.
 * The parentInterface would be a `FormControlInterface<FormValue<Name>>` that
 *  controls the full name's value.
 * The extractChildValue function accepts a name and either "first" or "last",
 *  then produces a `FormControlInterface<FormValue<string>>` for that part.
 * The recombineChildValue function reverses this process, accepting a full
 *  name as well as a key and value representing either the first or last name.
 * TParent is then `FormValue<Name>`, and TMap is `Name` itself.
 * This function would return another function that encodes the "composite"
 *  of name as a first and last name; call it with "first" to get the
 *  `FormControlInterface<FormValue<string>>` for the first name, and likewise
 *  for the last name.
 *
 * @param parentInterface - A base FormControl that will be split.
 * @param extractChildValue - Logic for generating a child value from a parent value based on the key.
 * @param recombineChildValue - Logic for adjusting a parent value due to a child value change.
 * @typeParam TParent - The type of a parent value.
 * @typeParam TMap - Encodes the child value type for each key.
 */
export function splitFormControl<TParent, TMap>(
  parentInterface: FormControlInterface<TParent>,
  extractChildValue: ValueExtractor<TParent, TMap>,
  recombineChildValue: ValueRecombiner<TParent, TMap>,
): CompositeFormControlInterface<TMap> {
  // Since two children may update independently,
  //  we must ensure their updates don't race.
  const handleIterativeChange = facilitateIterativeChanges(parentInterface);
  // Once we have the key, we have the information needed to translate
  //  from the parent control interface to the child control interface.
  return <K extends keyof TMap>(key: K) => {
    return translateFormControlForKey(
      parentInterface.value,
      handleIterativeChange,
      extractChildValue,
      recombineChildValue,
      key,
    );
  };
}

/**
 * A FormControlInterface that must first be indexed (via function application).
 * @param key - indicates which child interface is desired.
 * @typeParam TMap - Encodes the child value type for each key.
 */
export type CompositeFormControlInterface<TMap> = <K extends keyof TMap>(
  key: K,
) => FormControlInterface<TMap[K]>;

/**
 * Generates a child value from a parent value based on an identifying key.
 * @param parentValue - the value from which the child value should be extracted.
 * @param key - indicates which child value is desired.
 * @typeParam TMap - Encodes the child value type for each key.
 * @typeParam TParent - The value type the children are based on.
 * @typeParam K - A (possibly singleton) set of keys the extraction can cover.
 */
export type ValueExtractor<TParent, TMap> = <K extends keyof TMap>(
  parentValue: TParent,
  key: K,
) => TMap[K];

/**
 * Generates a new parent value based on a previous value and a particular new child value.
 * @param prevParentValue - a source value that will absorb the child's changed.
 * @param nextChildValue - the child value to incorporate into the parent value.
 * @param key - indicates which child is to be recombined.
 * @typeParam TMap - Encodes the child value type for each key.
 * @typeParam TParent - The value type the children are based on.
 * @typeParam K - A (possibly singleton) set of keys indicating possible children to recombine.
 */
export type ValueRecombiner<TParent, TMap> = <K extends keyof TMap>(
  prevParentValue: TParent,
  nextChildValue: TMap[K],
  key: K,
) => TParent;

/**
 * Produces a FormControlInterface for a logical child of the provided value and change handler.
 * @param parentValue - A base value to translate based on a key.
 * @param onChange - A handler for value changes.
 * @param extractChildValue - Logic for generating a child value from a parent value based on the key.
 * @param recombineChildValue - Logic for adjusting a parent value due to a child value change.
 * @param key - The key that indicates which child to translate to.
 * @typeParam TParent - The type of a parent value.
 * @typeParam TMap - Encodes the child value type for each key.
 * @typeParam K - A (possibly singleton) set of keys that may direct translation.
 */
function translateFormControlForKey<TParent, TMap, K extends keyof TMap>(
  parentValue: TParent,
  onChange: Handler<Mapper<TParent, TParent>>,
  extractChildValue: ValueExtractor<TParent, TMap>,
  recombineChildValue: ValueRecombiner<TParent, TMap>,
  key: K,
): FormControlInterface<TMap[K]> {
  return {
    value: extractChildValue(parentValue, key),
    onValueChange: (nextChildValue: TMap[K]) => {
      onChange((prevParentValue) =>
        recombineChildValue(prevParentValue, nextChildValue, key),
      );
    },
  };
}
