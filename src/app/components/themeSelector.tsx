"use client";

import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./themeSelector.module.css";

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
  var toolTiptext: string = isDark ? "Light theme" : "Dark theme";

  return (
    <Tooltip label={toolTiptext}>
      <ActionIcon
        className={classes.icon}
        onClick={() => toggleColorScheme()}
        aria-label="Toggle color theme"
      >
        <ThemeIcon isDark={isDark} />
      </ActionIcon>
    </Tooltip>
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
