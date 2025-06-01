import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { Box, Paper } from "@mantine/core";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { Pages } from "@/components/layout/pages";
import PageSelector from "@/components/admin/page_selector";
import LoginForm from "../components/admin/login/login_form";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookie";
import { getStoredPageContent } from "@/actions/mongodb/pages/management";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Admin | Kevin Logan Electrical - Your Trusted Electrician",
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

export default async function Admin() {
  const { user } = await getCurrentSession();

  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => rawNonce ?? "");

  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
      <Container>
        {user === null ? (
          <LoginForm />
        ) : (
          <PageSelector initialPromise={getStoredPageContent(Pages.Home)} />
        )}
      </Container>
    </ReCaptchaProvider>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, "main_section"].join(" ")}
        withBorder
      >
        {children}
      </Paper>
    </Box>
  );
}
