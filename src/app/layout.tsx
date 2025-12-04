import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "./components/layout/footer";
import { ColorSchemeScript, Box, Paper, mantineHtmlProps } from "@mantine/core";
import { Providers } from "@/components/layout/providers";
import { headers } from "next/headers";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import classes from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
  metadataBase: new URL("https://www.kevinloganelectrical.co.nz"),
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
    .then((rawNonce) => rawNonce ?? "");

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
      </head>
      <body className={classes.body}>
        <Providers nonce={nonce}>
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
