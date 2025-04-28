import { Paper, List, ListItem, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

import classes from "./services_card.module.css";

//Card for services section of rate and services page
export function ServicesCard({
  headerIcon,
  headerText,
  listItems,
}: {
  headerIcon: any;
  headerText: string;
  listItems: string[];
}) {
  return (
    <Paper
      className={[classes.services_list, "main_section"].join(" ")}
      withBorder
    >
      <ThemeIcon className={"list_icon"}>{headerIcon}</ThemeIcon>
      <h5>{headerText}</h5>
      <List
        icon={
          <ThemeIcon className={"checkmark"}>
            <IconCircleCheck />
          </ThemeIcon>
        }
      >
        {listItems.map((i: string) => (
          <ListItem key={i}>{i}</ListItem>
        ))}
      </List>
    </Paper>
  );
}
