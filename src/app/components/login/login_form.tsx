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
import { schema } from "@/utils/login_form_validation";
import RecaptchaDisclaimer from "@/components/recaptcha/disclaimer";
import { LoginFormResponse, validateLoginForm } from "@/actions/login/validate";
import { useReCaptcha } from "next-recaptcha-v3";
import classes from "./login_form.module.css";
import { setSessionTokenCookie } from "@/actions/mongodb/sessions/cookie";
import {
  ReadonlyURLSearchParams,
  redirect,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { FormAlert, FormMessage } from "@/components/form/form_alert";

export type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  //Form
  const { executeRecaptcha, loaded, error } = useReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginFormData>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });

  //Form message
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const isLoggedOut: string | null = searchParams.get("logout");
  const defaultMessage: FormMessage = isLoggedOut
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
      setFormMessage({
        message: "Check your internet connection",
        isError: true,
      });

      return {
        validated: true,
        formErrors: {},
        recaptchaVerified: true,
        session: null,
      };
    });

    //Handle form post-validation
    if (response.validated && response.recaptchaVerified && response.session) {
      setFormMessage({
        message: "Successfully logged in! Please wait...",
      });

      await setSessionTokenCookie(
        response.session.token,
        response.session.expires_at
      );

      return redirect("/admin");
    } else {
      form.setErrors(response.formErrors);

      if (!response.recaptchaVerified) {
        setFormMessage({
          message: "reCAPTCHA failed",
          isError: true,
        });
      } else if (Object.keys(response.formErrors).length === 0) {
        setFormMessage({
          message: "Incorrect username or password",
          isError: true,
        });
      }
    }

    setIsSubmitting(false);
  }

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
        <Fieldset legend="Please log in to continue">
          <Stack>
            <FormAlert formMessage={formMessage} />
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
