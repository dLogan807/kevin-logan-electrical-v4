import { createTheme, DEFAULT_THEME, mergeMantineTheme } from "@mantine/core";
import classes from "./theme.module.css";

//Theme
const themeOverride = createTheme({
  primaryColor: "pleasant-blue",
  colors: {
    "pleasant-blue": [
      "#e4f8ff",
      "#d2eafc",
      "#a8d2f2",
      "#7bb8e7",
      "#56a3df",
      "#3d96da",
      "#2d8fd9",
      "#1a7bc1",
      "#056eae",
      "#005f9c",
    ],
  },
  autoContrast: true,
  components: {
    ActionIcon: {
      classNames: {
        root: classes.action_icon,
        icon: classes.action_icon_icon,
      },
    },
    ThemeIcon: {
      classNames: {
        root: classes.theme_icon,
      },
    },
  },
  breakpoints: {
    xs: "30em",
    sm: "52em",
    md: "62em",
    lg: "71em",
    xl: "88em",
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
