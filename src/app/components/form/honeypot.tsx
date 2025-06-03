import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export default function Honeypot({
  form,
  label,
  fieldKey,
}: {
  form: UseFormReturnType<any>;
  label: string;
  fieldKey: string;
}) {
  return (
    <TextInput
      label={label}
      key={form.key(fieldKey)}
      {...form.getInputProps(fieldKey)}
      tabIndex={-1}
      pos="absolute"
      left="-9999px"
      aria-hidden="true"
      autoComplete="nope"
    />
  );
}
