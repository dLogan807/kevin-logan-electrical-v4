"use client";

import React from "react";
import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from "@mantine/core";
import { ColorScheme, ColorSchemeProvider } from "@mantine/styles";
import { useLocalStorage } from "@mantine/hooks";

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
    sm: "50em",
    md: "62em",
    lg: "71em",
    xl: "88em",
  },
  primaryColor: "pleasant-blue",
  colors: {
    "pleasant-blue": siteColors,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // set theme in local store
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "kle-colour-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={theme} defaultColorScheme="auto">
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
