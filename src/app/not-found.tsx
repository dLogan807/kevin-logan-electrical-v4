import { Button, Paper, Text, Box } from "@mantine/core";
import Link from "next/link";
import { Metadata } from "next";

import classes from "@/error.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | Kevin Logan Electrical - Your Trusted Electrician",
  description: "The page could not be found.",
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
    <Box className={[classes.notfound_grid, "content_grid"].join(" ")}>
      <Paper className={[classes.container, mainSection].join(" ")} withBorder>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Text className={classes.explanation}>
          Sorry! Either the page you&apos;re looking for does not exist or has
          been moved.
        </Text>
        <Link href="/" className={classes.home_button}>
          <Button>Back to Home</Button>
        </Link>
      </Paper>
    </Box>
  );
}
