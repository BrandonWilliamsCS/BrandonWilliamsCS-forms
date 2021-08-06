import { Handler } from "../utility/Handler";

/** Defines the elements necessary for utilizing the bahvior of a form. */
export interface FormBehaviorHandle<T, TSubmit> {
  currentValue: T;
  changeValue: Handler<T>;
  triggerSubmit: (submitValue: TSubmit) => void;
}
