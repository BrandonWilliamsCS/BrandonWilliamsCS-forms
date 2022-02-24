import { map } from "rxjs";
import { Mapper } from "../../utility";
import { mapFormValue } from "../FormValue";
import { FormValueConsumer } from "../FormValueConsumer";

export function translateValueConsumer<S, T, E>(
  sourceConsumer: FormValueConsumer<S, E>,
  valueSourceMapper: Mapper<S, T>,
  valueChangeMapper: Mapper<T, S>,
): FormValueConsumer<T, E> {
  // TODO: need to account for validation somehow
  return {
    valueSource: sourceConsumer.valueSource.pipe(map(valueSourceMapper)),
    onFormValueChange: (targetFormValue) => {
      sourceConsumer.onFormValueChange(
        targetFormValue
          ? mapFormValue(targetFormValue, valueChangeMapper)
          : undefined,
      );
    },
  };
}
