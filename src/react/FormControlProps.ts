import { FormControlInterface } from "../control";

/** Indicates the data recommended for form control components. */
export interface FormControlProps<T, E> {
  /** The interface for reading and writing values from the control */
  controlInterface: FormControlInterface<T, E>;
}
