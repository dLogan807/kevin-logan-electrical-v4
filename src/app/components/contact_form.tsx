"use client";

import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { sendContactEmail } from "@/utils/contact_email";

import classes from "./contact_form.module.css";

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
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.union([
    z
      .string()
      .regex(phoneRegex, { message: "Please enter a valid phone number" }),
    z.literal(""),
  ]),
  jobDetails: z.intersection(
    z.string().min(1, { message: "Please enter a few details" }),
    z.string().max(2000, { message: "Maximum 2000 characters" })
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

  function onSubmit(data: ContactFormData) {
    sendContactEmail(data);
  }

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Name"
        placeholder="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        className={classes.form_field}
        withAsterisk
        label="Email"
        placeholder="email@example.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        className={classes.form_field}
        label="Phone"
        placeholder="Phone"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
      />
      <Textarea
        className={classes.form_field}
        withAsterisk
        label="Job details"
        placeholder="A short description"
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
