import React from "react";

import { Handler } from "utility/Handler";
import { FormBehaviorHandle } from "./FormBehaviorHandle";

/**
 * Maintains a value across changes and "submits" that value when triggered.
 * @param onSubmit Handles the submission of values from a form.
 * @param initialValue The value a form should present if submitted without change.
 */
export function useFormBehavior<T>(
  onSubmit: Handler<T>,
  initialValue: T,
): FormBehaviorHandle<T> {
  const [currentValue, setCurrentValue] = React.useState<T>(initialValue);
  const triggerSubmit = () => onSubmit(currentValue);
  return {
    currentValue,
    changeValue: setCurrentValue,
    triggerSubmit,
  };
}
