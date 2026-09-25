import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./theme_selector.module.css";

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const isDarkTheme = computedColorScheme === "dark";
  const tooltipText = `Switch to ${isDarkTheme ? "light" : "dark"} theme`;

  return (
    <Tooltip
      label={tooltipText}
      events={{ hover: true, focus: true, touch: false }}
    >
      <ActionIcon
        className={classes.icon_container}
        onClick={toggleColorScheme}
        aria-label={tooltipText}
      >
        {isDarkTheme ? (
          <IconSun aria-hidden="true" className={classes.icon} />
        ) : (
          <IconMoonStars aria-hidden="true" className={classes.icon} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
