import React from "react";
import {
  PromiseStatus,
  useDelayedState,
  usePromiseStatus,
} from "@blueharborsolutions/react-data-tools";

import { useInterceptedFormBehavior } from "../form";
import {
  buildListenerInterceptor,
  combineInterceptors,
  Handler,
  HandlerInterceptor,
} from "../utility";
import {
  interceptValidatedSubmit,
  ValidatedValue,
} from "../validation/validatedValue/index";

/**
 * Encapsulates validation checking and status around basic form behavior.
 * @param onSubmit What to do with the form's value when ultimately submitted
 */
export function useValidatedForm<TRaw, TFinal, E>(
  onSubmit: (value: TFinal) => Promise<void>,
): FormVitals<TRaw, E> {
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [submitPromise, handleUltimateSubmit] = useDelayedState(onSubmit);
  const submitStatus = usePromiseStatus(submitPromise);

  const submitInterceptor = buildSubmitInterceptor<TRaw, TFinal, E>(() => {
    setSubmitAttempted(true);
  });
  const { currentValue, changeValue, triggerSubmit } =
    useInterceptedFormBehavior<ValidatedValue<TRaw, E> | undefined, TFinal>(
      handleUltimateSubmit,
      undefined,
      submitInterceptor,
    );

  return {
    submitAttempted,
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
  submitAttempted: boolean;
}

function buildSubmitInterceptor<TRaw, TFinal, E>(
  onSubmitAttempt: Handler<ValidatedValue<TRaw, E> | undefined>,
): HandlerInterceptor<ValidatedValue<TRaw, E> | undefined, TFinal> {
  const attemptListnerInterceptor = buildListenerInterceptor(onSubmitAttempt);
  return combineInterceptors(
    attemptListnerInterceptor,
    interceptValidatedSubmit,
  );
}
