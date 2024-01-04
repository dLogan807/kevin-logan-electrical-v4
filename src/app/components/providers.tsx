"use client";

import React from "react";
import { MantineProvider } from "@mantine/core";
import { ColorScheme, ColorSchemeProvider } from "@mantine/styles";
import { useLocalStorage } from "@mantine/hooks";
import { theme } from "./theme";

//Overarching Mantine providers
export function Providers({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce: string;
}) {
  //Set theme in local store
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
      <MantineProvider
        theme={theme}
        defaultColorScheme="auto"
        getStyleNonce={() => {
          return nonce;
        }}
      >
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
