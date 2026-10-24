"use client";

import { Box, Paper, Title } from "@mantine/core";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import classes from "./LoginClient.module.css";
import LoginForm from "@/components/login/login_form";

type LoginClientProps = {
  nonce: string;
};

export default function LoginClient({ nonce }: LoginClientProps) {
  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
      <Box className={"content_grid"}>
        <Paper className={"main_section"} withBorder>
          <Title order={1} className={classes.heading}>
            Login
          </Title>
          <LoginForm key={nonce} />
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}
