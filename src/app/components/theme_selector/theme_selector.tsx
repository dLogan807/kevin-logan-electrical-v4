"use client";

import { ActionIcon, Tooltip, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./theme_selector.module.css";

//Icon for switching between light or dark theme
export function ThemeSelector() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const autoCurrentColorScheme: boolean = useColorScheme() === "dark";
  const currentColorScheme: boolean = colorScheme === "dark";

  const isDark: boolean =
    colorScheme === "auto" ? autoCurrentColorScheme : currentColorScheme;

  const tooltipText: string = isDark ? "Light theme" : "Dark theme";

  return (
    <Tooltip label={tooltipText}>
      <ActionIcon
        className={classes.icon_container}
        onClick={() => toggleColorScheme()}
        aria-label="Toggle color theme"
      >
        <ThemeIcon isDark={isDark} />
      </ActionIcon>
    </Tooltip>
  );
}

//Return a sun or moon icon depending on scheme
function ThemeIcon({ isDark }: { isDark: boolean }) {
  if (isDark == null) isDark = true;

  return isDark ? (
    <IconSun aria-label="Sun icon" className={classes.icon} />
  ) : (
    <IconMoonStars aria-label="Moon and stars icon" className={classes.icon} />
  );
}
