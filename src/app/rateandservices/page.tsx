import { Box, List, ListItem, Paper, Text, ThemeIcon } from "@mantine/core";
import {
  IconBulb,
  IconCircleCheck,
  IconSun,
  IconTool,
} from "@tabler/icons-react";
import { Metadata } from "next";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Rate & Services | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "I offer a wide range of residential services at Kevin Logan Electrical for an affordable rate of $90/hr incl GST.",
};

export default function RateAndServices() {
  const mainSection: string = "main_section";

  return (
    <Box className={classes.rateservice_grid}>
      <Paper
        withBorder
        className={[classes.rateservice_rate, mainSection].join(" ")}
      >
        <div>
          <h4>Standard Rate</h4>
          <Text>
            Hourly rate — $90/hr incl. GST Please note an additional travel
            charge dependent on mileage.
          </Text>
        </div>
        <div>
          <h4>Estimates</h4>
          <Text>
            Please call if you would like an estimate on the cost of a job.
            Often the price indicated over the phone is very close to the actual
            cost of the job. When the job is complete, an itemised invoice is
            given listing the materials used plus additional labour costs.
          </Text>
        </div>
      </Paper>
      <Paper
        className={[classes.rateservice_services, mainSection].join(" ")}
        withBorder
      >
        <h4>Services</h4>
        <Text>
          I offer a wide range of residential services. If you&apos;d like to
          inquire about a particular job, don&apos;t hesitate to give me a call.
        </Text>
        <Paper
          className={[classes.rateservice_services_list, mainSection].join(" ")}
          withBorder
        >
          <ThemeIcon className={classes.list_icon}>
            <IconBulb />
          </ThemeIcon>
          <h5>Interior</h5>
          <List
            icon={
              <ThemeIcon className={classes.checkmark}>
                <IconCircleCheck />
              </ThemeIcon>
            }
          >
            <ListItem>Lighting</ListItem>
            <ListItem>Power Points</ListItem>
            <ListItem>Hot water faults</ListItem>
            <ListItem>Hood / Fan Installations</ListItem>
            <ListItem>Fault-finding</ListItem>
          </List>
        </Paper>
        <Paper
          className={[classes.rateservice_services_list, mainSection].join(" ")}
          withBorder
        >
          <ThemeIcon className={classes.list_icon}>
            <IconSun />
          </ThemeIcon>
          <h5>Exterior</h5>
          <List
            icon={
              <ThemeIcon className={classes.checkmark}>
                <IconCircleCheck />
              </ThemeIcon>
            }
          >
            <ListItem>Outdoor lighting / Sockets</ListItem>
            <ListItem>Garden lighting</ListItem>
            <ListItem>Security lights</ListItem>
            <ListItem>Swimming pools / Spa pools</ListItem>
            <ListItem>Sub mains to exterior buildings</ListItem>
            <ListItem>EV charge stations</ListItem>
          </List>
        </Paper>
        <Paper
          className={[classes.rateservice_services_list, mainSection].join(" ")}
          withBorder
        >
          <ThemeIcon className={classes.list_icon}>
            <IconTool />
          </ThemeIcon>
          <h5>Renovations & Maintenance</h5>
          <List
            icon={
              <ThemeIcon className={classes.checkmark}>
                <IconCircleCheck />
              </ThemeIcon>
            }
          >
            <ListItem>Switchboard upgrades</ListItem>
            <ListItem>Oven / Hob repairs</ListItem>
            <ListItem>Complete rewires</ListItem>
            <ListItem>Kitchens</ListItem>
            <ListItem>Bathrooms</ListItem>
          </List>
        </Paper>
      </Paper>
    </Box>
  );
}
