import { ThemeIcon, ThemeIconProps } from "@mantine/core";
import classes from "./TransparentThemeIcon.module.css";

type TransparentThemeIconProps = {
  children: ThemeIconProps["children"];
};

export default function TransparentThemeIcon({
  children,
}: TransparentThemeIconProps) {
  return (
    <ThemeIcon classNames={{ root: classes.transparent_theme_icon }}>
      {children}
    </ThemeIcon>
  );
}
