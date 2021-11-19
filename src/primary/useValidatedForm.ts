import React from "react";
import { PromiseStatus } from "@blueharborsolutions/data-tools/promise";
import {
  useDelayedState,
  usePromiseStatus,
} from "@blueharborsolutions/react-data-tools";

import { useFormBehavior } from "../form";
import { Handler } from "../utility";
import { ValidatedValue } from "../validation/validatedValue/index";
import { FormSubmission } from "../form/FormSubmission";

/**
 * Encapsulates validation checking and status around basic form behavior.
 * @param onSubmit What to do with the form's value when ultimately submitted
 */
export function useValidatedForm<TRaw, TFinal, E, TSubmit = void>(
  onSubmit: (value: TFinal, submitValue: TSubmit) => Promise<void>,
): FormVitals<TRaw, E, TSubmit> {
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [submitPromise, handleUltimateSubmit] = useDelayedState(
    (submission: FormSubmission<TFinal, TSubmit>) =>
      onSubmit(submission.value, submission.submitValue),
  );

  // TODO: could afford to extract this.
  const handleSubmitAttempt: Handler<
    FormSubmission<ValidatedValue<TRaw, E> | undefined, TSubmit>
  > = (submission) => {
    // Even if validation fails, record the attempt.
    // TODO: extra responsibility. Could be done by caller?
    setSubmitAttempted(true);
    if (submission.value?.validity.isValid) {
      // Trust that `isValid` implies the value is really TFinal.
      return handleUltimateSubmit({
        value: submission.value.value as unknown as TFinal,
        submitValue: submission.submitValue,
      });
    }
  };
  const { currentValue, changeValue, triggerSubmit } = useFormBehavior<
    ValidatedValue<TRaw, E> | undefined,
    TSubmit
  >(handleSubmitAttempt, undefined);

  // Usage will almost always involve a status indicator, so save consumers the
  // hassle by giving them a status instead of just a promise.
  const submitStatus = usePromiseStatus(submitPromise);
  return {
    submitAttempted,
    currentValue,
    changeValue,
    triggerSubmit,
    submitStatus,
  };
}

export interface FormVitals<TRaw, E, TSubmit> {
  currentValue: ValidatedValue<TRaw, E> | undefined;
  changeValue: Handler<ValidatedValue<TRaw, E>>;
  triggerSubmit: (submitValue: TSubmit) => void;
  submitStatus: PromiseStatus<void> | undefined;
  submitAttempted: boolean;
}
