import { Anchor, Box, ThemeIcon, Text, Stack, Group } from "@mantine/core";
import {
  IconBrandMantine,
  IconBrandNextjs,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { theme } from "@/components/theme";
import logo from "@/assets/logo.webp";
import classes from "./footer.module.css";

export function Footer() {
  return (
    <Box className={classes.footer}>
      <Stack className={classes.contact} gap="lg">
        <h3>Call Kevin</h3>
        <Anchor href="tel:+64274978473" aria-label="Mobile phone number">
          <Group>
            <ThemeIcon className={"checkmark"}>
              <IconPhone aria-label="Phone icon" />
            </ThemeIcon>
            0274 978 473
          </Group>
        </Anchor>
      </Stack>
      <Link href="/">
        <Image
          className={classes.logo}
          src={logo}
          alt="Kevin Logan Electrical logo"
          sizes={`(max-width: ${theme.breakpoints.sm}) 50vw, (max-width: ${theme.breakpoints.md}) 30vw, (min-width: ${theme.breakpoints.lg}) 20vw`}
        />
      </Link>
      <Stack className={classes.site_info} gap="xs">
        <Text>Site design by Dylan Logan</Text>
        <Group>
          <Text>Powered by</Text>
          <Link
            className={classes.centered_icon_link}
            href={"https://nextjs.org/"}
            aria-label="Next.js website"
          >
            <ThemeIcon className={"checkmark"}>
              <IconBrandNextjs aria-label="Next.js icon" />
            </ThemeIcon>
          </Link>
          <Link
            className={classes.centered_icon_link}
            href={"https://mantine.dev/"}
            aria-label="Mantine website"
          >
            <ThemeIcon className={"checkmark"}>
              <IconBrandMantine aria-label="Mantine icon" />
            </ThemeIcon>
          </Link>
        </Group>
        <Link href={"/licenses"} aria-label="Open source licenses used">
          Open source licenses
        </Link>
      </Stack>
    </Box>
  );
}
