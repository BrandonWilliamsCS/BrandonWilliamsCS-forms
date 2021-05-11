import { FormBehaviorHandle } from "../form/FormBehaviorHandle";
import { useFormBehavior } from "../form/useFormBehavior";
import { Handler } from "../utility/Handler";
import { HandlerInterceptor } from "../utility/HandlerInterceptor";
import { interceptHandler } from "../utility/interceptHandler";

/**
 * Maintains a value across changes and "submits" that value when triggered, subject to interception.
 * Here, "interception" means to make decisions on how and when to actually change or submit.
 * For example, a change interceptor could auto-format phone number values,
 *  and a submit interceptor could reject invalid values from submission.
 * @param onSubmit Handles the submission of values from a form.
 * @param initialValue The value a form should present if submitted without change.
 * @param submitInterceptor Intercept submission of the form value.
 * @param changeInterceptor Intercept changes to the form value.
 */
export function useInterceptedFormBehavior<RawFormValue, FinalFormValue>(
  onSubmit: Handler<FinalFormValue>,
  initialValue: RawFormValue,
  submitInterceptor: HandlerInterceptor<RawFormValue, FinalFormValue>,
  changeInterceptor?: HandlerInterceptor<RawFormValue>,
): FormBehaviorHandle<RawFormValue> {
  const handleRawSubmit = interceptHandler(onSubmit, submitInterceptor);
  const {
    currentValue,
    changeValue: handleBaseValueChange,
    triggerSubmit,
  } = useFormBehavior(handleRawSubmit, initialValue);
  const changeValue = interceptHandler<RawFormValue, RawFormValue>(
    handleBaseValueChange,
    changeInterceptor ?? ((rawValue, base) => base(rawValue)),
  );
  return {
    currentValue,
    changeValue,
    triggerSubmit,
  };
}
