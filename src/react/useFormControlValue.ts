import React from "react";
import {
  useStableValue,
  useSubscription,
} from "@blueharborsolutions/react-data-tools";

import { FormValueConsumer } from "../value";
import { CoreFormControlValue } from "../control";
import { Validator } from "../validation";

export function useFormControlValue<T, E>(
  valueConsumer: FormValueConsumer<T, E[]>,
  defaultValue: T,
  validator?: Validator<T, E>,
  equalityComparer = (a: T, b: T) => a === b,
  providedValueModel?: CoreFormControlValue<T, E>,
) {
  const valueModel = useStableValue(
    () =>
      providedValueModel ??
      new CoreFormControlValue(defaultValue, validator, equalityComparer),
    [providedValueModel],
  );
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
  return {
    formValue,
    clearValue: valueModel.clearValue.bind(valueModel),
    onValueChange: valueModel.setValue.bind(valueModel),
  };
}
