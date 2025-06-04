"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IconLock, IconUserCircle } from "@tabler/icons-react";
import RecaptchaDisclaimer from "@/components/recaptcha/disclaimer";
import { LoginFormResponse, validateLoginForm } from "@/actions/login/validate";
import { useReCaptcha } from "next-recaptcha-v3";
import classes from "./login_form.module.css";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { FormAlert, FormMessage } from "@/components/form/form_alert";
import Honeypot from "../form/honeypot";
import { FormType, getFormSchema } from "@/utils/form_schemas/schemas";

export type LoginFormData = {
  username: string;
  password: string;
  email?: string;
};

function getFormMessage(response: LoginFormResponse): FormMessage {
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
  } else if (!response.recaptchaVerified) {
    return { message: "reCAPTCHA failed", isError: true };
  } else if (!response.sessionCreated) {
    return {
      message: "Incorrect username or password",
      isError: true,
    };
  } else {
    return { message: "Successfully logged in! Please wait..." };
  }
}

export default function LoginForm() {
  //Form
  const { executeRecaptcha, loaded, error } = useReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = getFormSchema(FormType.LOGIN);
  const form = useForm<LoginFormData>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  //Form message
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const loggedOut: string | null = searchParams.get("logout");
  const defaultMessage: FormMessage = loggedOut
    ? {
        message: "Successfully logged out",
      }
    : {};

  const [formMessage, setFormMessage] = useState<FormMessage>(defaultMessage);

  //Clear logout URI params
  const router = useRouter();
  useEffect(() => {
    router.replace("/login", { scroll: false });
  }, [router]);

  //Handle submit
  async function onSubmit(formValues: LoginFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormMessage({ message: "" });

    //Get recaptcha token
    const action: string = "login_form_submit";
    const token: string =
      loaded && !error ? await executeRecaptcha(action).catch(() => "") : "";

    const response: LoginFormResponse = await validateLoginForm(
      formValues,
      token,
      action
    ).catch(() => ({
      validated: false,
      formErrors: {},
      recaptchaVerified: false,
      submitError: true,
      sessionCreated: false,
    }));

    setFormMessage(getFormMessage(response));
    form.setErrors(response.formErrors);

    if (
      response.validated &&
      response.recaptchaVerified &&
      response.sessionCreated
    ) {
      router.push("/admin");
    } else {
      setIsSubmitting(false);
    }
  }

  const userIcon: React.ReactElement = (
    <IconUserCircle className={classes.input_icon} />
  );
  const passwordIcon: React.ReactElement = (
    <IconLock className={classes.input_icon} />
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      className={classes.form}
    >
      <Stack className={classes.form_stack}>
        <Fieldset legend="Please log in to continue">
          <Stack>
            <Honeypot form={form} label="Email" fieldKey="email" />
            <TextInput
              label="Username"
              leftSection={userIcon}
              key={form.key("username")}
              {...form.getInputProps("username")}
              disabled={isSubmitting}
            />
            <PasswordInput
              label="Password"
              leftSection={passwordIcon}
              key={form.key("password")}
              {...form.getInputProps("password")}
              disabled={isSubmitting}
            />
            <FormAlert formMessage={formMessage} />
            <Box className={classes.submit_button_group}>
              <Button type="submit" variant="filled" loading={isSubmitting}>
                Login
              </Button>
            </Box>
          </Stack>
        </Fieldset>
        <RecaptchaDisclaimer className={classes.recaptcha_disclaimer} />
      </Stack>
    </form>
  );
}
