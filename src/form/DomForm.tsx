import React from "react";

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
