import React from "react";

export function FocusableFieldset({
  children,
  onBlur,
  onFocus,
  ...fieldsetProps
}: React.PropsWithChildren<FocusableFieldsetProps>) {
  const [isManagingFocus, setIsManagingFocus] = React.useState(false);
  const timerRef = React.useRef<number | undefined>();

  const onComponentBlur = (event: React.FocusEvent<HTMLFieldSetElement>) => {
    timerRef.current = window.setTimeout(() => {
      if (isManagingFocus) {
        setIsManagingFocus(false);
        onBlur(event);
      }
    }, 0);
  };

  const onComponentFocus = (event: React.FocusEvent<HTMLFieldSetElement>) => {
    window.clearTimeout(timerRef.current);
    if (!isManagingFocus) {
      setIsManagingFocus(true);
      onFocus(event);
    }
  };
  return (
    <fieldset
      {...fieldsetProps}
      onBlur={onComponentBlur}
      onFocus={onComponentFocus}
    >
      {children}
    </fieldset>
  );
}

export interface FocusableFieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  onBlur: React.FocusEventHandler<HTMLElement>;
  onFocus: React.FocusEventHandler<HTMLElement>;
}
