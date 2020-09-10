import React from "react";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

export function FormLayout({
  children,
  disabled,
  formClassName,
  formBodyClassName,
  hasError,
  onSubmit,
  statusText,
  submitLabel,
  ...formProps
}: React.PropsWithChildren<FormLayoutProps>) {
  const classes = useStyles();
  return (
    <form
      {...formProps}
      className={formClassName}
      onSubmit={!disabled ? onSubmit : noOpSubmit}
    >
      <fieldset
        className={clsx(classes.fieldset, formBodyClassName)}
        disabled={disabled}
      >
        {children}
      </fieldset>
      <div className={classes.actions}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={disabled}
        >
          {submitLabel}
        </Button>
        <Typography
          variant="body2"
          color={hasError ? "error" : "textSecondary"}
          className={classes.note}
          role="status"
        >
          {statusText}
        </Typography>
      </div>
    </form>
  );
}

export interface FormLayoutProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  disabled?: boolean;
  formClassName?: string;
  formBodyClassName?: string;
  hasError?: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  statusText?: string;
  submitLabel: string;
}

export interface StatusMessages {
  initial?: string;
  processing?: string;
  success?: string;
  error?: string;
  invalid?: string;
}

const useStyles = makeStyles((theme) => ({
  fieldset: {
    border: "none",
    margin: 0,
    padding: 0,
  },
  actions: {
    display: "flex",
    alignItems: "center",
  },
  note: {
    marginLeft: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

function noOpSubmit(e: React.FormEvent) {
  e.preventDefault();
}
