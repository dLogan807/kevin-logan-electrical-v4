import React from "react";
import { Alert } from "@mantine/core";
import { IconExclamationCircle, IconCircleCheck } from "@tabler/icons-react";
import classes from "./form_alert.module.css";

export type FormMessage = {
  message?: React.ReactNode;
  isError?: boolean;
};

export function FormAlert({ formMessage }: { formMessage: FormMessage }) {
  const errorIcon: React.ReactElement = formMessage.isError ? (
    <IconExclamationCircle
      className={classes.input_icon}
      aria-label="Failure"
    />
  ) : (
    <IconCircleCheck className={classes.input_icon} aria-label="Success" />
  );

  const colour: string = formMessage.isError ? "red" : "green";

  return (
    <Alert
      variant="light"
      color={colour}
      title={formMessage.message}
      icon={errorIcon}
      hidden={!formMessage.message}
    />
  );
}
