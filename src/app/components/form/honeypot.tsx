import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type HoneypotProps<T> = {
  form: UseFormReturnType<T>;
  label: string;
  fieldKey: string;
};

export default function Honeypot<T>({
  form,
  label,
  fieldKey,
}: HoneypotProps<T>) {
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
