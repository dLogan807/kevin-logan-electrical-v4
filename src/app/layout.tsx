import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ColorSchemeScript, Box, Paper } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Providers } from "@/components/providers";
import { headers } from "next/headers";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import classes from "./layout.module.css";
import "./globals.css";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
  openGraph: {
    title: "Kevin Logan Electrical - Your Trusted Electrician",
    description:
      "Providing the North Shore with a quality electrical service for over 30 years.",
    type: "website",
    url: "https://www.kevinloganelectrical.co.nz",
    siteName: "Kevin Logan Electrical",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => {
      return rawNonce == undefined ? "" : rawNonce;
    });

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
      </head>
      <body className={classes.body}>
        <Providers nonce={nonce}>
          <Notifications />
          <Box className={classes.grid}>
            <Box></Box>
            <Paper className={classes.nav_container}>
              <Navbar />
            </Paper>
            <Box></Box>
            <Box></Box>
            <Box className={classes.content_container}>
              {children}
              <Footer />
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
