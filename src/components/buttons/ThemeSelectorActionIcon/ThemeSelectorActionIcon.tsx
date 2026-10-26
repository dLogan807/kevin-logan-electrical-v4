import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./ThemeSelectorActionIcon.module.css";

export function ThemeSelectorActionIcon() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = () =>
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");

  const isDarkTheme = computedColorScheme === "dark";
  const tooltipText = `Switch to ${isDarkTheme ? "light" : "dark"} theme`;

  return (
    <Tooltip
      label={tooltipText}
      events={{ hover: true, focus: true, touch: false }}
    >
      <ActionIcon
        classNames={{ root: classes.action_icon_root }}
        onClick={toggleColorScheme}
        aria-label={tooltipText}
      >
        {isDarkTheme ? <IconSun aria-hidden /> : <IconMoonStars aria-hidden />}
      </ActionIcon>
    </Tooltip>
  );
}
