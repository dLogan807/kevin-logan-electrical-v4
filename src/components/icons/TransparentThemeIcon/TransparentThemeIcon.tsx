import { ThemeIcon, ThemeIconProps } from "@mantine/core";
import classes from "./TransparentThemeIcon.module.css";

type TransparentThemeIconProps = Omit<ThemeIconProps, "classNames">;

export default function TransparentThemeIcon({
  children,
  ...rest
}: TransparentThemeIconProps) {
  return (
    <ThemeIcon classNames={{ root: classes.transparent_theme_icon }} {...rest}>
      {children}
    </ThemeIcon>
  );
}
