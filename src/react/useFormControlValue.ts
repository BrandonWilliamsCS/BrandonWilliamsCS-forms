import React from "react";
import {
  useStableValue,
  useSubscription,
} from "@brandonwilliamscs/react-data-tools";

import { FormValueConsumer } from "../value";
import { CoreFormControlValue } from "../control";
import { Validator } from "../validation";

export function useFormControlValue<T, E>(
  valueConsumer: FormValueConsumer<T, E[]>,
  initialValue: T,
  validator?: Validator<T, E>,
  equalityComparer = (a: T, b: T) => a === b,
  providedValueModel?: CoreFormControlValue<T, E>,
) {
  const valueModel = useStableValue(() => {
    if (providedValueModel) {
      return providedValueModel;
    }
    const createdValueModel = new CoreFormControlValue(
      validator,
      equalityComparer,
    );
    createdValueModel.setValue(initialValue);
    return createdValueModel;
  }, [providedValueModel]);
  valueModel.setValidator(validator);

  // Render with the latest defined FormValue (which is initially present until cleared)
  const [formValue, setFormValue] = React.useState(valueModel.formValue!);
  useSubscription(valueModel.formValues, (nextFormValue) => {
    if (nextFormValue) {
      setFormValue(nextFormValue);
    }
    valueConsumer.onFormValueChange(nextFormValue);
  });
  useSubscription(valueConsumer.valueSource, (baseValue) => {
    valueModel.setValue(baseValue);
  });
  // Initial model value was set on creation, but subscribers need to know about the change.
  React.useEffect(() => {
    // This will fire twice if React "remounts"; that's acceptable.
    valueConsumer.onFormValueChange(valueModel.formValue);
  }, []);
  return {
    formValue,
    clearValue: valueModel.clearValue.bind(valueModel),
    onValueChange: valueModel.setValue.bind(valueModel),
  };
}
