import { Box, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type HoneypotInputProps<T> = {
  form: UseFormReturnType<T>;
  label: string;
  fieldKey: string;
};

export default function HoneypotInput<T>({
  form,
  label,
  fieldKey,
}: HoneypotInputProps<T>) {
  return (
    <Box
      aria-hidden="true"
      inert
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <TextInput
        label={label}
        key={form.key(fieldKey)}
        {...form.getInputProps(fieldKey)}
        tabIndex={-1}
        autoComplete="off"
      />
    </Box>
  );
}
