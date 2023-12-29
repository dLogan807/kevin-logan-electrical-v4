import "@mantine/core/styles.css";
import React from "react";
import type { Metadata } from "next";
import { Navbar } from "./components/navbar";
import { ColorSchemeScript, Box, Paper } from "@mantine/core";
import classes from "./layout.module.css";
import { Providers } from "./components/providers";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className={classes.body}>
        <Providers>
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
