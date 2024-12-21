import { Anchor, Box, ThemeIcon, Text } from "@mantine/core";
import classes from "./footer.module.css";
import {
  IconBrandMantine,
  IconBrandNextjs,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <Box className={classes.footer}>
      <ThemeIcon className={"checkmark"}>
        <IconPhone aria-label="Phone icon" />
      </ThemeIcon>
      <Anchor href="tel:+64274978473">0274 978 473</Anchor>
      <Text>Site design by Dylan Logan</Text>
      <Text>Powered by</Text>
      <Link href={"https://nextjs.org/"}>
        <ThemeIcon className={"checkmark"}>
          <IconBrandNextjs aria-label="Next.js icon" />
        </ThemeIcon>
      </Link>
      <Link href={"https://mantine.dev/"}>
        <ThemeIcon className={"checkmark"}>
          <IconBrandMantine aria-label="Mantine icon" />
        </ThemeIcon>
      </Link>
      <Link href={"/licenses"}>Open source licenses</Link>
    </Box>
  );
}
