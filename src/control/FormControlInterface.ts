import { Handler } from "../utility/Handler";

/** Represents a form control's side of a contract with a form. */
export interface FormControlInterface<T> {
  value: T;
  onValueChange: Handler<T>;
}
