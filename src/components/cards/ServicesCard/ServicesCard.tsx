import {
  Paper,
  List,
  ListItem,
  ThemeIcon,
  Title,
  ThemeIconProps,
  TitleProps,
  Box,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import classes from "./ServicesCard.module.css";
import TransparentThemeIcon from "@/components/icons/TransparentThemeIcon/TransparentThemeIcon";

type ServicesCardProps = {
  titleOrder: TitleProps["order"];
  headerIcon: ThemeIconProps["children"];
  headerText: string;
  listItems: string[];
};

export function ServicesCard({
  titleOrder,
  headerIcon,
  headerText,
  listItems,
}: ServicesCardProps) {
  return (
    <Paper
      classNames={{ root: `${classes.services_paper_root} main_section` }}
      withBorder
    >
      <Box>
        <TransparentThemeIcon>{headerIcon}</TransparentThemeIcon>
        <Title order={titleOrder}>{headerText}</Title>
      </Box>
      <List
        classNames={{ root: classes.services_list }}
        icon={
          <ThemeIcon>
            <IconCircleCheck />
          </ThemeIcon>
        }
      >
        {listItems.map((listItem, idx) => (
          <ListItem key={idx}>{listItem}</ListItem>
        ))}
      </List>
    </Paper>
  );
}
