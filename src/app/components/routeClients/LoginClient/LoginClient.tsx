"use client";

import { Box, Paper } from "@mantine/core";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import classes from "./LoginClient.module.css";
import LoginForm from "@/components/login/login_form";

type LoginClientProps = {
  nonce: string;
  loggedOut: boolean;
};

export default function LoginClient({ nonce, loggedOut }: LoginClientProps) {
  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
      <Box className={"content_grid"}>
        <Paper className={"main_section"} withBorder>
          <h1 className={classes.heading}>Login</h1>
          <LoginForm key={nonce} loggedOut={loggedOut} />
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}
