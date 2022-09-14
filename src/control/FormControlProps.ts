import { Observable } from "rxjs";
import { FormValue } from "../value";

//!! could have FormFieldProps extend this
export interface FormControlProps<T, E> {
  confirmations?: Observable<void>;
  disabled?: boolean;
  onValueChange: (value: T) => void;
  prefix?: string;
  readonly?: boolean;
  values: Observable<FormValue<T, E> | undefined>;
  initialFormValue: FormValue<T, E> | undefined;
}

//!!!!!!! Move below stuff to group

//!! goes into the group-level model
//!! actually, just take the FormControlProps?!?
//!! but also need to allow group specifics
// - name, to extend prefix
// - group-level validation
// - group-level confirmations (e.g., tabbbed out of last field without ever touching first)
export interface FormGroupControlSpec<T, E> {
  confirmations?: Observable<void>;
  onValueChange: (value: T) => void;
  prefix?: string;
  values: Observable<FormValue<T, E> | undefined>;
  initialFormValue: FormValue<T, E> | undefined;
}

//!! goes in to the "get child props function" of group level model
export interface FormGroupChildControlSpec<TParent, TChild, E> {
  //!! should be a dedicated param instead.
  name: string;
  readonly?: boolean;
  disabled?: boolean;
  //!! initialValue of T here? 
}

//!! comes out of the "get child props" function
//!! deliberately a subset of fields in FormControlProps<T, E>
//!! actually... exactly the same.
//!! what, in theory, would NOT come from the parent?
//!!  - contextual stuff is obviously parent-sourced
//!!  - contextual stuff is obviously parent-sourced
export interface FormGroupChildControlProps<T, E> {
  onValueChange: (value: T) => void;
  values: Observable<FormValue<T, E> | undefined>;
  initialFormValue: FormValue<T, E> | undefined;
  //!! same for all... "contextual"
  confirmations?: Observable<void>;
  prefix?: string;
  //!! combined - so give child version to creation function
  readonly?: boolean;
  disabled?: boolean;
}
