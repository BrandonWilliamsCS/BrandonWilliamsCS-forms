import { Validator } from "../validation";
import { FormControlProps } from "./FormControlProps";

/** Indicates the data recommended for form control components that represent a single "field". */
export interface FieldFormControlProps<T, E> extends FormControlProps<T, E> {
  label: string;
  name: string;
  validator?: Validator<T | undefined, E>;
  /** Indicates that a control should be disabled and report no value */
  disabled?: boolean;
}
