import {
  PromiseStatus,
  useDelayedState,
  usePromiseStatus,
} from "@blueharborsolutions/react-data-tools";

import { useInterceptedFormBehavior } from "../form";
import { combineInterceptors, Handler, HandlerInterceptor } from "../utility";
import { FormControlState, initialFormControlState } from "./FormControlState";
import { interceptValidatedSubmit } from "./interceptValidatedSubmit";

export function useForm<TRaw, TFinal>(
  onSubmit: (value: TFinal) => Promise<void>,
  initialValue: TRaw,
  secondarySubmitInterceptor?: HandlerInterceptor<TFinal>,
  changeInterceptor?: HandlerInterceptor<FormControlState<TRaw>>,
): FormVitals<TRaw> {
  const [submitPromise, handleUltimateSubmit] = useDelayedState(onSubmit);
  const submitStatus = usePromiseStatus(submitPromise);

  const submitInterceptor: HandlerInterceptor<FormControlState<TRaw>, TFinal> =
    secondarySubmitInterceptor
      ? combineInterceptors(
          interceptValidatedSubmit,
          secondarySubmitInterceptor,
        )
      : interceptValidatedSubmit;
  const { currentValue, changeValue, triggerSubmit } =
    useInterceptedFormBehavior<FormControlState<TRaw>, TFinal>(
      handleUltimateSubmit,
      initialFormControlState(initialValue),
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
  currentValue: FormControlState<TRaw>;
  changeValue: Handler<FormControlState<TRaw>>;
  triggerSubmit: () => void;
  submitStatus: PromiseStatus<void> | undefined;
}
