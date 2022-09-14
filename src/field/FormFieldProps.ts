import { FormControlProps } from "../control/FormControlProps";
import { Validator } from "../validation";

export interface FormFieldProps<T, E> extends FormControlProps<T, E> {
  //!! this is not a custom suffix; it's the whole thing.
  id?: string;
  label: string;
  name: string;
  validator?: Validator<T, E>;
  //!! Base field will need a default base value, but that is likely hard-coded to the formfield component
}
