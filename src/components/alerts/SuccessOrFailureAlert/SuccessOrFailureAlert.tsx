import { ReactElement } from "react";
import { Alert } from "@mantine/core";
import { IconExclamationCircle, IconCircleCheck } from "@tabler/icons-react";
import { SuccessOrFailureAlertState } from "@/types/successOrFailureAlertState";
import classes from "./SuccessOrFailureAlert.module.css";

type SuccessOrFailureAlertProps = { state: SuccessOrFailureAlertState };

export function SuccessOrFailureAlert({ state }: SuccessOrFailureAlertProps) {
  const errorIcon: ReactElement = state.isError ? (
    <IconExclamationCircle
      className={classes.input_icon}
      aria-label="Failure"
    />
  ) : (
    <IconCircleCheck className={classes.input_icon} aria-label="Success" />
  );

  const colour = state.isError ? "red" : "green";

  return (
    <Alert
      variant="light"
      color={colour}
      title={state.message}
      icon={errorIcon}
      hidden={!state.message}
    />
  );
}
