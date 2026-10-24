"use client";

import { Button, Paper, Text, Box, Title } from "@mantine/core";
import Link from "next/link";
import { Metadata } from "next";

import classes from "@/app/error.module.css";

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
  const mainSection = "main_section";

  return (
    <Box className={`${classes.error_grid} content_grid`}>
      <Paper className={`${classes.container} ${mainSection}`} withBorder>
        <Title order={1}>Error</Title>
        <Title order={2}>Something unexpected happened.</Title>
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
