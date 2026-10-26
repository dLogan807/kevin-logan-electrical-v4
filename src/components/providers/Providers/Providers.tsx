"use client";

import { ReactNode } from "react";
import {
  localStorageColorSchemeManager,
  MantineProvider,
  v8CssVariablesResolver,
} from "@mantine/core";
import { theme } from "@/theme";

export function Providers({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce: string;
}) {
  const colorSchemeManager = localStorageColorSchemeManager({
    key: "kle-colour-scheme",
  });

  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      colorSchemeManager={colorSchemeManager}
      getStyleNonce={() => nonce}
      cssVariablesResolver={v8CssVariablesResolver}
    >
      {children}
    </MantineProvider>
  );
}
