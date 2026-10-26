"use client";

import { useState, SubmitEvent, useEffect, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { IconLock, IconUserCircle } from "@tabler/icons-react";
import CloudflareTurnstileWidget from "@/components/cloudflare/CloudflareTurnstileWidget/CloudflareTurnstileWidget";
import { useRouter, useSearchParams } from "next/navigation";
import HoneypotInput from "@/components/inputs/HoneyPotInput/HoneypotInput";
import { SuccessOrFailureAlertState } from "@/types/successOrFailureAlertState";
import { SuccessOrFailureAlert } from "@/components/alerts/SuccessOrFailureAlert/SuccessOrFailureAlert";
import { useDisclosure } from "@mantine/hooks";
import { loginFormSchema } from "@/utils/schemas/form/loginFormSchema";
import { LoginFormValues } from "@/types/formValues";
import { LoginFormResponse } from "@/types/formReponse";
import { validateLoginForm } from "@/actions/form/validateLoginForm";
import classes from "./LoginForm.module.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("logout") != null;

  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, { toggle }] = useDisclosure(false);
  const [formAlertState, setFormAlertState] =
    useState<SuccessOrFailureAlertState>(
      loggedOut ? { message: "Successfully logged out" } : {},
    );

  useEffect(() => {
    if (loggedOut) {
      window.history.replaceState(null, "", "/login");
    }
  }, [loggedOut]);

  // Reset state once hidden
  useLayoutEffect(() => {
    return () => {
      form.reset();
      setCanSubmit(false);
      setFormAlertState({});
    };
  }, []);

  const form = useForm<LoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      website: "",
      turnstileToken: "",
    },
    validate: zod4Resolver(loginFormSchema),
    validateInputOnBlur: true,
  });

  //Handle submit
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    // Fix Firefox autofill
    const data = new FormData(e.currentTarget);
    form.setValues({
      username: String(data.get("username") ?? ""),
      password: String(data.get("password") ?? ""),
    });

    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setIsSubmitting(true);
    setFormAlertState({ message: "" });
    if (passwordVisible) toggle();

    const response = await validateLoginForm(form.getValues()).catch(() => ({
      validated: false,
      formErrors: {},
      turnstileVerfied: false,
      submitError: true,
      sessionCreated: false,
    }));

    setFormAlertState(getFormMessage(response));
    form.setErrors(response.formErrors);

    if (
      response.validated &&
      response.turnstileVerfied &&
      response.sessionCreated
    ) {
      setIsSubmitting(false);
      router.push("/admin");
    } else {
      setIsSubmitting(false);
    }
  }

  function handleTurnstileTokenChange(token: string) {
    form.setFieldValue("turnstileToken", token);

    setCanSubmit(!!token);
  }

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <Stack className={classes.form_stack}>
        <Fieldset legend="Please log in to continue">
          <Stack>
            <HoneypotInput key={form.key("website")} label="Website" />
            <TextInput
              key={form.key("username")}
              {...form.getInputProps("username")}
              name="username"
              label="Username"
              leftSection={
                <IconUserCircle className={classes.input_icon} aria-hidden />
              }
              disabled={isSubmitting}
            />
            <PasswordInput
              name="password"
              label="Password"
              leftSection={
                <IconLock className={classes.input_icon} aria-hidden />
              }
              key={form.key("password")}
              {...form.getInputProps("password")}
              onVisibilityChange={toggle}
              visible={passwordVisible}
              disabled={isSubmitting}
            />
            <CloudflareTurnstileWidget
              onTurnstileTokenChange={handleTurnstileTokenChange}
            />
            <SuccessOrFailureAlert state={formAlertState} />
            <Box className={classes.submit_button_group}>
              <Button
                type="submit"
                variant="filled"
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                Login
              </Button>
            </Box>
          </Stack>
        </Fieldset>
      </Stack>
    </form>
  );
}

function getFormMessage(
  response: LoginFormResponse,
): SuccessOrFailureAlertState {
  if (response.submitError) {
    return {
      message: "Check your internet connection",
      isError: true,
    };
  } else if (!response.validated) {
    return {
      message: "Check required fields for errors",
      isError: true,
    };
  } else if (!response.turnstileVerfied) {
    return { message: "Turnstile captcha failed", isError: true };
  } else if (!response.sessionCreated) {
    return {
      message: "Incorrect username or password",
      isError: true,
    };
  } else {
    return { message: "Successfully logged in! Please wait..." };
  }
}
