"use client";

import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export function ContactForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      details: "",
    },

    validate: {
      name: (value) => (/^\S+$/.test(value) ? null : "Please enter your name"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      details: (value) =>
        value.length < 2000 ? null : "Maximum 2000 characters",
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput
        withAsterisk
        label="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        withAsterisk
        label="Email"
        placeholder="email@example.com"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        label="Phone"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
      />
      <Textarea
        label="Job details"
        resize="vertical"
        minRows={4}
        autosize
        key={form.key("details")}
        {...form.getInputProps("details")}
      />
      <Group>
        <Button type="submit">Send</Button>
      </Group>
    </form>
  );
}
