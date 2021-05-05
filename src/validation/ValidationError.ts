/**
 * Minimally indicates an invalidity of some value.
 * Applications should implement their own schema for producing and consuming
 *  ValidationErrors based on the `type` value.
 */
export interface ValidationError {
  readonly type: string;
}
