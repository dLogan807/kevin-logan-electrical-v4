"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import cx from "clsx";
import classes from "./themeSelector.module.css";

//Icon for switching between light or dark theme
export function ThemeSelector() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      {dark ? (
        <IconMoonStars
          className={cx(classes.icon, classes.dark)}
          stroke={1.5}
        />
      ) : (
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      )}
    </ActionIcon>
  );
}

//Return a sun or moon icon depending on scheme
// function ThemeIcon(colorScheme: any) {
//   return colorScheme.colorScheme === "light" ? (
//     <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
//   ) : (
//     <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
//   );
// }
