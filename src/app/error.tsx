"use client";

import { Button, Paper, Text, Box } from "@mantine/core";
import Link from "next/link";
import { Metadata } from "next";

import classes from "@/error.module.css";

export const metadata: Metadata = {
  title: "Page Error | Kevin Logan Electrical - Your Trusted Electrician",
  description: "A website error occured.",
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

export default function NotFound() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.error_grid, "content_grid"].join(" ")}>
      <Paper className={[classes.container, mainSection].join(" ")} withBorder>
        <h1>Error</h1>
        <h2>Something unexpected happened.</h2>
        <Text className={classes.explanation}>
          Sorry! Please check your internet connection and try again.
        </Text>
        <Link href="/" className={classes.home_button}>
          <Button>Back to Home</Button>
        </Link>
      </Paper>
    </Box>
  );
}
