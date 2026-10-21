import {
  createTheme,
  mergeMantineTheme,
  MantineColorsTuple,
  DEFAULT_THEME,
} from "@mantine/core";

//Theme colours
const siteColors: MantineColorsTuple = [
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
];

//Theme
const themeOverride = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "52em",
    md: "62em",
    lg: "71em",
    xl: "88em",
  },
  primaryColor: "pleasant-blue",
  colors: {
    "pleasant-blue": siteColors,
  },
  autoContrast: true,
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
