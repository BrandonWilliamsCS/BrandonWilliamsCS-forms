import { Handler } from "../utility/Handler";

/** Defines the elements necessary for utilizing the bahvior of a form. */
export interface FormBehaviorHandle<T> {
  currentValue: T;
  changeValue: Handler<T>;
  triggerSubmit: () => void;
}
