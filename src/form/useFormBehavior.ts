import React from "react";

import { Handler } from "../utility/Handler";
import { FormBehaviorHandle } from "./FormBehaviorHandle";
import { FormSubmission } from "./FormSubmission";

/**
 * Maintains a value across changes and "submits" that value when triggered.
 * @param onSubmit Handles the submission of values from a form.
 * @param initialValue The value a form should present if submitted without change.
 */
export function useFormBehavior<T, TSubmit>(
  onSubmit: Handler<FormSubmission<T, TSubmit>>,
  initialValue: T,
): FormBehaviorHandle<T, TSubmit> {
  const [currentValue, setCurrentValue] = React.useState<T>(initialValue);
  const triggerSubmit = (submitValue: TSubmit) =>
    onSubmit({ value: currentValue, submitValue });
  return {
    currentValue,
    changeValue: setCurrentValue,
    triggerSubmit,
  };
}
