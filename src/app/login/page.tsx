import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Box, Paper } from "@mantine/core";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import LoginForm from "../components/login/login_form";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookie";
import classes from "./page.module.css";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Kevin Logan Electrical - Your Trusted Electrician",
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

export default async function Login() {
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/admin");

  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => rawNonce ?? "");

  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
      <Box className={"content_grid"}>
        <Paper className={"main_section"} withBorder>
          <h1 className={classes.heading}>Login</h1>
          <LoginForm />
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}
