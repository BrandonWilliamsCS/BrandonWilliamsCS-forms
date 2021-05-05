/**
 * Determines whether an object is "hollow", meaning any keys have no value defined.
 * @param obj the object to check for substance
 * @returns whether or not the object is hollow
 */
export function isObjectHollow(obj: {}): boolean {
  return Object.values(obj).reduce<boolean>(
    (hollowSoFar, nextValue) => hollowSoFar && nextValue === undefined,
    true,
  );
}
