import { Subscribable } from "@blueharborsolutions/data-tools/observable";

import { Handler } from "../utility/Handler";
import { FormValue } from "../value/FormValue";

/** Represents a form control's side of a contract with a form. */
export interface FormControlInterface<T, E> {
  valueSource: Subscribable<T>;
  onValueChange: Handler<FormValue<T, E>>;
}
