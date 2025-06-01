"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconExclamationCircle,
  IconLock,
  IconUserCircle,
} from "@tabler/icons-react";
import { schema } from "@/utils/login_form_validation";
import RecaptchaDisclaimer from "@/components/recaptcha/disclaimer";
import {
  LoginFormResponse,
  validateLoginForm,
} from "@/actions/admin/validate_login";
import { useReCaptcha } from "next-recaptcha-v3";
import classes from "./login_form.module.css";
import { setSessionTokenCookie } from "@/actions/mongodb/sessions/cookie";

export type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const { executeRecaptcha, loaded, error } = useReCaptcha();
  const form = useForm<LoginFormData>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  async function onSubmit(formValues: LoginFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError("");

    //Get recaptcha token
    const action: string = "login_form_submit";
    const token: string =
      loaded && !error
        ? await executeRecaptcha(action).catch(() => {
            return "";
          })
        : "";

    const response: LoginFormResponse = await validateLoginForm(
      formValues,
      token,
      action
    ).catch(() => {
      setFormError("Check your internet connection");

      return {
        validated: true,
        formErrors: {},
        recaptchaVerified: true,
        session: null,
      };
    });

    //Handle form post-validation
    if (response.validated && response.recaptchaVerified && response.session) {
      //Where is it best to call these? Client or server?
      await setSessionTokenCookie(
        response.session.token,
        response.session.expires_at
      );

      form.reset();
    } else {
      form.setErrors(response.formErrors);

      if (!response.recaptchaVerified) {
        setFormError("reCAPTCHA failed");
      } else if (Object.keys(response.formErrors).length === 0) {
        setFormError("Username or password is incorrect");
      }
    }

    setIsSubmitting(false);
  }

  const errorIcon: React.ReactElement = (
    <IconExclamationCircle className={classes.input_icon} />
  );
  const userIcon: React.ReactElement = (
    <IconUserCircle className={classes.input_icon} />
  );
  const passwordIcon: React.ReactElement = (
    <IconLock className={classes.input_icon} />
  );

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onSubmit(values);
      })}
      className={classes.form}
    >
      <Stack className={classes.form_stack}>
        <h1 className={classes.heading}>Admin</h1>
        <Fieldset legend="Please log in to continue">
          <Stack>
            <Alert
              variant="light"
              color="red"
              title={formError}
              icon={errorIcon}
              hidden={formError === ""}
            />
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
