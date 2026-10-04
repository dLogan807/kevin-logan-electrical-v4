"use client";

import { ReactNode } from "react";
import { localStorageColorSchemeManager, MantineProvider } from "@mantine/core";
import { theme } from "@/components/theme";

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
    >
      {children}
    </MantineProvider>
  );
}
