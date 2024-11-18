"use client";

import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { sendContactEmail } from "@/utils/contact_email";

import classes from "./contact_form.module.css";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
//import { useState } from "react";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
};

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const schema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.union([
    z
      .string()
      .regex(phoneRegex, { message: "Please enter a valid phone number" }),
    z.literal(""),
  ]),
  jobDetails: z.intersection(
    z.string().min(1, { message: "Please enter a few details" }),
    z.string().max(2000, { message: "Sorry, maximum 2000 characters" })
  ),
});

export function ContactForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      jobDetails: "",
    },
    validate: zodResolver(schema),
  });

  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: ContactFormData) {
    const sendingNotifID = notifications.show({
      title: "Sending your email...",
      message: "Hold tight!",
      autoClose: false,
      loading: true,
      withBorder: true,
    });

    await sendContactEmail(data).then((responseMessage) => {
      const icon = responseMessage.success ? (
        <IconCheck className={classes.icon} aria-label="Success icon" />
      ) : (
        <IconX className={classes.icon} aria-label="Failure icon" />
      );
      const colour: string = responseMessage.success ? "green" : "red";

      notifications.update({
        id: sendingNotifID,
        title: responseMessage.message,
        message: responseMessage.details,
        loading: false,
        autoClose: 7000,
        icon: icon,
        color: colour,
      });

      if (responseMessage.success) {
        form.reset();
      }
    });
  }

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Your name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Email"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        className={classes.form_field}
        label="Phone"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
      />
      <Textarea
        className={classes.form_field}
        withAsterisk
        label="Job details"
        resize="vertical"
        minRows={4}
        autosize
        key={form.key("jobDetails")}
        {...form.getInputProps("jobDetails")}
      />
      <Group>
        <Button className={classes.submit_button} type="submit">
          Send
        </Button>
      </Group>
    </form>
  );
}
