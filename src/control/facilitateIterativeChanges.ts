import { Handler } from "../utility/Handler";
import { Mapper } from "../utility/Mapper";
import { FormControlInterface } from "./FormControlInterface";

/**
 * Wraps a control's change handler function so that rapid changes can be applied in proper sequence.
 * @param controlInterface The form control whose changes must apply sequentially
 * @returns a new change handler that accepts a stepper from old to new values.
 */
export function facilitateIterativeChanges<T>(
  controlInterface: FormControlInterface<T>,
): Handler<Mapper<T>> {
  // Close over a variable that records the latest value
  let latestValue = controlInterface.value;
  return (stepper) => {
    const newValue = stepper(latestValue);
    latestValue = newValue;
    controlInterface.onValueChange(newValue);
  };
}
