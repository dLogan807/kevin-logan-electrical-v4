import { Box, TextInput } from "@mantine/core";

type HoneypotInputProps = {
  label: string;
};

export default function HoneypotInput({ label }: HoneypotInputProps) {
  return (
    <Box
      aria-hidden
      inert
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <TextInput label={label} tabIndex={-1} autoComplete="off" />
    </Box>
  );
}
