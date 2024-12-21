import { Anchor, Box, ThemeIcon, Text } from "@mantine/core";
import classes from "./footer.module.css";
import { IconPhone } from "@tabler/icons-react";

export function Footer() {
  return (
    <Box className={classes.footer}>
      <ThemeIcon className={"checkmark"}>
        <IconPhone aria-label="Phone icon" />
      </ThemeIcon>
      <Anchor href="tel:+64274978473">0274 978 473</Anchor>
      <Text>Site design by Dylan Logan</Text>
      <Text>Open source licenses</Text>
    </Box>
  );
}
