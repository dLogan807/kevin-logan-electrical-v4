"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

//Icon for switching between light or dark theme
export function ThemeSelector() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="lg"
      aria-label="Toggle color theme"
    >
      <ThemeIcon dark={dark} />
    </ActionIcon>
  );
}

//Return a sun or moon icon depending on scheme
function ThemeIcon(dark: any) {
  return dark.dark ? <IconMoonStars stroke={1.5} /> : <IconSun stroke={1.5} />;
}
