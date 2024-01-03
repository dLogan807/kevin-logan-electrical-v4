import "@mantine/core/styles.css";
import React from "react";
import type { Metadata } from "next";
import { Navbar } from "./components/navbar";
import { ColorSchemeScript, Box, Paper } from "@mantine/core";
import classes from "./layout.module.css";
import { Providers } from "./components/providers";
import { headers } from "next/headers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let rawNonce = headers().get("x-nonce");
  let nonce: string = rawNonce == undefined ? "" : rawNonce;
  console.log("Nonce (layout.tsx): " + nonce);

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={classes.body}>
        <Providers nonce={nonce}>
          <Box className={classes.grid}>
            <Box></Box>
            <Paper className={classes.nav_container} shadow="sm">
              <Navbar />
            </Paper>
            <Box></Box>
            <Box></Box>
            <Box className={classes.content_container}>{children}</Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
