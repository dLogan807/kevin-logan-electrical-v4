import { ReactNode } from "react";

export type SuccessOrFailureAlertState = {
  message?: ReactNode;
  isError?: boolean;
};
