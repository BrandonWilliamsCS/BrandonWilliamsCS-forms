import {
  PromiseStatus,
  useDelayedState,
  usePromiseStatus,
} from "@blueharborsolutions/react-data-tools";

import { useInterceptedFormBehavior } from "../form";
import { combineInterceptors, Handler, HandlerInterceptor } from "../utility";
import {
  initialValidatedValue,
  interceptValidatedSubmit,
  ValidatedValue,
} from "../validation/validatedValue/";

export function useForm<TRaw, TFinal>(
  onSubmit: (value: TFinal) => Promise<void>,
  initialValue: TRaw,
  secondarySubmitInterceptor?: HandlerInterceptor<TFinal>,
  changeInterceptor?: HandlerInterceptor<ValidatedValue<TRaw>>,
): FormVitals<TRaw> {
  const [submitPromise, handleUltimateSubmit] = useDelayedState(onSubmit);
  const submitStatus = usePromiseStatus(submitPromise);

  const submitInterceptor: HandlerInterceptor<ValidatedValue<TRaw>, TFinal> =
    secondarySubmitInterceptor
      ? combineInterceptors(
          interceptValidatedSubmit,
          secondarySubmitInterceptor,
        )
      : interceptValidatedSubmit;
  const { currentValue, changeValue, triggerSubmit } =
    useInterceptedFormBehavior<ValidatedValue<TRaw>, TFinal>(
      handleUltimateSubmit,
      initialValidatedValue(initialValue),
      submitInterceptor,
      changeInterceptor,
    );

  return {
    currentValue,
    changeValue,
    triggerSubmit,
    submitStatus,
  };
}

export interface FormVitals<TRaw> {
  currentValue: ValidatedValue<TRaw>;
  changeValue: Handler<ValidatedValue<TRaw>>;
  triggerSubmit: () => void;
  submitStatus: PromiseStatus<void> | undefined;
}
