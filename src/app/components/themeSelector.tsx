"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

//Icon for switching between light or dark theme
export function ThemeSelector() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const autoCurrentColorScheme: boolean = useColorScheme() === "dark";
  const currentColorScheme: boolean = colorScheme === "dark";

  var isDark: boolean;

  if (colorScheme === "auto") {
    isDark = autoCurrentColorScheme;
  } else {
    isDark = currentColorScheme;
  }

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="lg"
      aria-label="Toggle color theme"
    >
      <ThemeIcon isDark={isDark} />
    </ActionIcon>
  );
}

//Return a sun or moon icon depending on scheme
function ThemeIcon(isDark: any) {
  return isDark.isDark ? (
    <IconSun stroke={1.5} />
  ) : (
    <IconMoonStars stroke={1.5} />
  );
}
