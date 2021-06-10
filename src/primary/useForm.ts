import {
  PromiseStatus,
  useDelayedState,
  usePromiseStatus,
} from "@blueharborsolutions/react-data-tools";

import { useInterceptedFormBehavior } from "../form";
import { combineInterceptors, Handler, HandlerInterceptor } from "../utility";
import {
  interceptValidatedSubmit,
  ValidatedValue,
} from "../validation/validatedValue/index";

/**
 * Encapsulates several behaviors that enhance basic form behavior.
 * @param onSubmit What to do with the form's value when ultimately submitted
 * @param initialValue (deprecated)
 * @param secondarySubmitInterceptor optionally intercepts submit after validation
 * @param changeInterceptor optionally intercepts changes to the form value
 */
export function useForm<TRaw, TFinal, E>(
  onSubmit: (value: TFinal) => Promise<void>,
  secondarySubmitInterceptor?: HandlerInterceptor<TFinal>,
  changeInterceptor?: HandlerInterceptor<ValidatedValue<TRaw, E> | undefined>,
): FormVitals<TRaw, E> {
  const [submitPromise, handleUltimateSubmit] = useDelayedState(onSubmit);
  const submitStatus = usePromiseStatus(submitPromise);

  const submitInterceptor: HandlerInterceptor<
    ValidatedValue<TRaw, E> | undefined,
    TFinal
  > = secondarySubmitInterceptor
    ? combineInterceptors(interceptValidatedSubmit, secondarySubmitInterceptor)
    : interceptValidatedSubmit;
  const { currentValue, changeValue, triggerSubmit } =
    useInterceptedFormBehavior<ValidatedValue<TRaw, E> | undefined, TFinal>(
      handleUltimateSubmit,
      undefined,
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

export interface FormVitals<TRaw, E> {
  currentValue: ValidatedValue<TRaw, E> | undefined;
  changeValue: Handler<ValidatedValue<TRaw, E>>;
  triggerSubmit: () => void;
  submitStatus: PromiseStatus<void> | undefined;
}
