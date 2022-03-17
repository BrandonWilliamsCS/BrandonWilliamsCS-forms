import React from "react";
import { PromiseStatus } from "@blueharborsolutions/data-tools/promise";
import {
  useDelayedState,
  usePromiseStatus,
  useStableValue,
  useSubscription,
} from "@blueharborsolutions/react-data-tools";
import { FormModel, FormSubmission } from "../form";

/**
 * Encapsulates validation checking and status around basic form behavior.
 * @param onSubmit What to do with the form's value when ultimately submitted
 */
export function useForm<T, TFinal, E, TSubmit = void>(
  onSubmit: (value: TFinal, submitValue: TSubmit) => Promise<void>,
): FormVitals<T, E, TSubmit> {
  const formModel = useStableValue(() => new FormModel<T, TSubmit, E>(), []);
  const [submitPromise, handleUltimateSubmit] = useDelayedState(
    (submission: FormSubmission<T, TSubmit>) =>
      // assume that valid values are typed correctly.
      // TODO: is there a better conceptual way to do this?
      //   probably need to bake that into FormValue.
      onSubmit(submission.value as unknown as TFinal, submission.submitValue),
  );

  // This is a stopgap; when subscribing below, we need the latest
  //  handleUltimateSubmit to be called, not the closed-over one.
  // The typical solution is to repeat the useEffect per change,
  //  but that could cause subscription churn with the form model.
  const handleUltimateSubmitRef = React.useRef(handleUltimateSubmit);
  handleUltimateSubmitRef.current = handleUltimateSubmit;
  useSubscription(formModel.submits, (submission) => {
    if (submission.value.validity.isValid) {
      const validSubmission = {
        value: submission.value.value,
        submitValue: submission.submitValue,
      };
      handleUltimateSubmitRef.current(validSubmission);
    }
  });

  // Usage will almost always involve a status indicator, so save consumers the
  // hassle by giving them a status instead of just a promise.
  const submitStatus = usePromiseStatus(submitPromise);
  return {
    formModel,
    submitStatus,
    triggerSubmit: formModel.triggerSubmit.bind(formModel),
  };
}

export interface FormVitals<T, E, TSubmit> {
  formModel: FormModel<T, TSubmit, E>;
  submitStatus: PromiseStatus<void> | undefined;
  triggerSubmit: (submitValue: TSubmit) => void;
}
