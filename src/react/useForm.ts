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
export function useForm<T, E, TSubmit = void>(
  onSubmit: (value: T, submitValue: TSubmit) => Promise<void>,
): FormVitals<T, E, TSubmit> {
  const formModel = useStableValue(() => new FormModel<T, TSubmit, E>(), []);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [submitPromise, handleUltimateSubmit] = useDelayedState(
    (submission: FormSubmission<T, TSubmit>) =>
      onSubmit(submission.value, submission.submitValue),
  );

  // TODO: ripe for extraction to more prescriptive tool
  const triggerSubmit: Handler<TSubmit> = (submitValue) => {
    setSubmitAttempted(true);
    formModel.triggerSubmit(submitValue);
  };

  React.useEffect(() => {
    return formModel.subscribe({
      next: (submission) => {
        return handleUltimateSubmit(submission);
      },
    }).unsubscribe;
  }, [formModel]);

  // Usage will almost always involve a status indicator, so save consumers the
  // hassle by giving them a status instead of just a promise.
  // TODO: actually, work it into a more cohesive submit tracking model.
  // -last attempt, local success, full success
  // -timestamp (as class), current status
  // -consider history "log" and let consumers interpret
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
