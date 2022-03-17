import { toPairs } from "lodash";

/**
 * Detects ordering of string keys based on equality to reference values.
 * @remarks
 * When working with array FormValueConsumers, it is not just the current order
 * of the *values* that matters, but that of the *child items* that consume
 * those values. For example, in a list of two children, removing the first one
 * is not equivalent to removing the second and replacing it with the first. To
 * account for this, child values are associated with a key string and the order
 * is maintained as an ordering of those keys.
 *
 * However, parent values and form values do not specify these keys, but only
 * a value array. In particular, order must be *detected* from each incoming
 * parent array value before they can be matched to the proper child consumers.
 * In practice, this means matching incoming child values to their last known
 * "reference" value. All unmatched incoming values are treated as entirely new
 * children and given new keys.
 */
export class KeyOrderDetector<T> {
  private referenceValues = new Map<string, T>();

  public constructor(
    // TODO: accomodate "pure" getter for when values have natural key
    private readonly keyGen: (value: T) => string,
    private readonly valueEquals?: (a: T, b: T) => boolean,
  ) {}

  public setReferenceValues(values: Record<string, T>) {
    this.referenceValues = new Map<string, T>();
    toPairs(values).forEach(([key, value]) => {
      this.referenceValues.set(key, value);
    });
  }

  public keyifyByReferenceValue(arrayValue: T[]): Array<[string, T]> {
    const localReferenceValues = new Map(this.referenceValues);
    return arrayValue.map((childValue) => {
      const existingKey = this.consumeReferenceValue(
        childValue,
        localReferenceValues,
      );
      const key = existingKey ?? this.keyGen(childValue);
      // Make sure key detection is idempotent - if a value is generated, save it.
      this.referenceValues.set(key, childValue);
      return [key, childValue] as [string, T];
    });
  }

  private consumeReferenceValue(
    value: T,
    referenceValues: Map<string, T>,
  ): string | undefined {
    const valueEquals = this.valueEquals ?? defaultEquals;
    const matchingKey = Array.from(referenceValues.entries()).find(
      ([, referenceValue]) => valueEquals(value, referenceValue),
    )?.[0];
    if (!matchingKey) {
      return undefined;
    }
    // Remove the key so that it won't be matched again.
    referenceValues.delete(matchingKey);
    return matchingKey;
  }
}

const defaultEquals = <T>(a: T, b: T) => a === b;
