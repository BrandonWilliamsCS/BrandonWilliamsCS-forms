import React from "react";
import { PromiseStatus } from "@blueharborsolutions/data-tools/promise";
import {
  useDelayedState,
  usePromiseStatus,
  useStableValue,
} from "@blueharborsolutions/react-data-tools";

import { FormControlInterface } from "../control";
import { FormModel, FormSubmission } from "../form";
import { Handler } from "../utility";

/**
 * Encapsulates validation checking and status around basic form behavior.
 * @param onSubmit What to do with the form's value when ultimately submitted
 */
export function useForm<T, TFinal, E, TSubmit = void>(
  onSubmit: (value: TFinal, submitValue: TSubmit) => Promise<void>,
): FormVitals<T, E, TSubmit> {
  const formModel = useStableValue(() => new FormModel<T, TSubmit, E>(), []);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [submitPromise, handleUltimateSubmit] = useDelayedState(
    (submission: FormSubmission<T, TSubmit>) =>
      // assume that valid values are typed correctly.
      onSubmit(submission.value as unknown as TFinal, submission.submitValue),
  );

  const triggerSubmit: Handler<TSubmit> = (submitValue) => {
    setSubmitAttempted(true);
    formModel.triggerSubmit(submitValue);
  };

  // This is a stopgap; when subscribing below, we need the latest
  //  handleUltimateSubmit to be called, not the closed-over one.
  // The typical solution is to repeat the useEffect per change,
  //  but that could cause subscription churn with the form model.
  const handleUltimateSubmitRef = React.useRef(handleUltimateSubmit);
  handleUltimateSubmitRef.current = handleUltimateSubmit;
  React.useEffect(() => {
    return formModel.subscribe({
      next: (submission) => {
        return handleUltimateSubmitRef.current(submission);
      },
    }).unsubscribe;
  }, [formModel]);

  // Usage will almost always involve a status indicator, so save consumers the
  // hassle by giving them a status instead of just a promise.
  const submitStatus = usePromiseStatus(submitPromise);
  return {
    controlInterface: formModel.controlModel,
    submitAttempted,
    submitStatus,
    triggerSubmit,
  };
}

export interface FormVitals<T, E, TSubmit> {
  controlInterface: FormControlInterface<T, E>;
  submitAttempted: boolean;
  submitStatus: PromiseStatus<void> | undefined;
  triggerSubmit: (submitValue: TSubmit) => void;
}
