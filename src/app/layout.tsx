import "@mantine/core/styles.css";
import React from "react";
import { Navbar } from "./components/navbar";
import {
  MantineProvider,
  ColorSchemeScript,
  createTheme,
  MantineColorsTuple,
  Box,
  Paper,
} from "@mantine/core";
import classes from "./layout.module.css";

export const metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

const siteColors: MantineColorsTuple = [
  "#e4f8ff",
  "#d2eafc",
  "#a8d2f2",
  "#7bb8e7",
  "#56a3df",
  "#3d96da",
  "#2d8fd9",
  "#1a7bc1",
  "#056eae",
  "#005f9c",
];

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  primaryColor: "pleasant-blue",
  colors: {
    "pleasant-blue": siteColors,
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={classes.body}>
        <MantineProvider theme={theme}>
          <Box className={classes.grid}>
            <Box></Box>
            <Paper className={classes.nav_container} radius="xs" shadow="sm">
              <Navbar />
            </Paper>
            <Box></Box>
            <Box></Box>
            {children}
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
