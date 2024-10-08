import { Paper, List, ListItem, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

import classes from "./servicesCard.module.css";
import React from "react";

//Card for services section of rate and services page
export function ServicesCard({
  headerIcon,
  headerText,
  listItems,
}: {
  headerIcon: React.JSX.Element;
  headerText: string;
  listItems: string[];
}) {
  return (
    <Paper
      className={[classes.services_list, "main_section"].join(" ")}
      withBorder
    >
      <ThemeIcon className={classes.list_icon}>{headerIcon}</ThemeIcon>
      <h5>{headerText}</h5>
      <List
        icon={
          <ThemeIcon className={classes.checkmark}>
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
