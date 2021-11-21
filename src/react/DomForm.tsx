import React from "react";

/**
 * Wraps the DOM/html form element to provide a more conceptually appropriate interface.
 * @param disabled allows submit behavior to be disabled at the form level
 * @param onSubmit called when the underlying form emits a submit event
 */
export const DomForm = React.forwardRef<HTMLFormElement, DomFormProps>(
  ({ children, disabled, onSubmit, ...formProps }, ref) => {
    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      if (!disabled) {
        onSubmit();
      }
    }
    return (
      <form {...formProps} onSubmit={handleSubmit} ref={ref}>
        {children}
      </form>
    );
  },
);

interface DomFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  disabled?: boolean;
  onSubmit: () => void;
}
