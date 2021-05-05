/**
 * Determines whether an array is "hollow", meaning entries are undefined.
 * @param arr the array to check for contents
 * @returns whether or not the array is hollow
 */
export function isArrayHollow(arr: any[]): boolean {
  return arr.reduce<boolean>(
    (hollowSoFar, nextValue) => hollowSoFar && nextValue === undefined,
    true,
  );
}
