"use client";

import { useState, SubmitEvent } from "react";
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
import RecaptchaDisclaimer from "@/components/recaptcha/disclaimer";
import { LoginFormResponse, validateLoginForm } from "@/actions/login/validate";
import { useReCaptcha } from "next-recaptcha-v3";
import classes from "./login_form.module.css";
import { useRouter } from "next/navigation";
import { FormAlert, FormMessage } from "@/components/form/form_alert";
import Honeypot from "@/components/form/honeypot";
import { FormType, getFormSchema } from "@/utils/schemas/form_schemas/schemas";
import { useDisclosure } from "@mantine/hooks";

export type LoginFormData = {
  username: string;
  password: string;
  website?: string;
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

type LoginFormProps = {
  loggedOut: boolean;
};

export default function LoginForm({ loggedOut }: LoginFormProps) {
  //Form
  const { executeRecaptcha, loaded, error } = useReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, { toggle }] = useDisclosure(false);
  const schema = getFormSchema(FormType.LOGIN);
  const form = useForm<LoginFormData>({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
      website: "",
    },
    validate: zod4Resolver(schema),
    validateInputOnBlur: true,
  });

  //Form message

  const [formMessage, setFormMessage] = useState<FormMessage>(
    loggedOut ? { message: "Successfully logged out" } : {},
  );
  const router = useRouter();

  //Handle submit
  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
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

    await handleSubmit(form.getValues());
  }

  async function handleSubmit(formValues: LoginFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormMessage({ message: "" });
    if (passwordVisible) toggle();

    //Get recaptcha token
    const action: string = "login_form_submit";
    const token: string =
      loaded && !error ? await executeRecaptcha(action).catch(() => "") : "";

    const response: LoginFormResponse = await validateLoginForm(
      formValues,
      token,
      action,
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

  return (
    <form onSubmit={onSubmit} className={classes.form}>
      <Stack className={classes.form_stack}>
        <Fieldset legend="Please log in to continue">
          <Stack>
            <Honeypot form={form} label="Website" fieldKey="website" />
            <TextInput
              name="username"
              label="Username"
              leftSection={
                <IconUserCircle
                  className={classes.input_icon}
                  aria-hidden="true"
                />
              }
              key={form.key("username")}
              {...form.getInputProps("username")}
              disabled={isSubmitting}
            />
            <PasswordInput
              name="password"
              label="Password"
              leftSection={
                <IconLock className={classes.input_icon} aria-hidden="true" />
              }
              key={form.key("password")}
              {...form.getInputProps("password")}
              onVisibilityChange={toggle}
              visible={passwordVisible}
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
