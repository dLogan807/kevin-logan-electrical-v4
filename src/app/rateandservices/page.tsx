import {
  Box,
  List,
  ListItem,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "./page.module.css";
import {
  IconBulb,
  IconCircleCheck,
  IconSun,
  IconTool,
} from "@tabler/icons-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rate & Services | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "I offer a wide range of residential services at Kevin Logan Electrical for an affordable rate of $90/hr incl GST.",
};

export default function RateAndServices() {
  return (
    <Box className={classes.rateservice_grid}>
      <Paper
        shadow="sm"
        radius="md"
        withBorder
        p="xl"
        className={classes.rateservice_rate}
      >
        <div>
          <Title order={4}>Standard Rate</Title>
          <Text>
            Hourly rate — $90/hr incl. GST Please note an additional travel
            charge dependent on mileage.
          </Text>
        </div>
        <div>
          <Title order={4}>Estimates</Title>
          <Text>
            Please call if you would like an estimate on the cost of a job.
            Often the price indicated over the phone is very close to the actual
            cost of the job. When the job is complete, an itemised invoice is
            given listing the materials used plus additional labour costs.
          </Text>
        </div>
      </Paper>
      <Paper
        shadow="sm"
        radius="md"
        withBorder
        p="xl"
        className={classes.rateservice_services}
      >
        <Title order={4}>Services</Title>
        <Text>
          I offer a wide range of residential services. If you&apos;d like to
          inquire about a particular job, don&apos;t hesitate to give me a call.
        </Text>
        <Paper
          className={classes.rateservice_services_list}
          shadow="sm"
          radius="md"
          withBorder
          p="md"
        >
          <ThemeIcon size="xl" variant="transparent">
            <IconBulb />
          </ThemeIcon>
          <Title order={5}>Interior</Title>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon size={24} radius="xl" variant="light">
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
          className={classes.rateservice_services_list}
          shadow="sm"
          radius="md"
          withBorder
          p="md"
        >
          <ThemeIcon size="xl" variant="transparent">
            <IconSun />
          </ThemeIcon>
          <Title order={5}>Exterior</Title>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon size={24} radius="xl" variant="light">
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
          className={classes.rateservice_services_list}
          shadow="sm"
          radius="md"
          withBorder
          p="md"
        >
          <ThemeIcon size="xl" variant="transparent">
            <IconTool />
          </ThemeIcon>
          <Title order={5}>Renovations & Maintenance</Title>
          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon size={24} radius="xl" variant="light">
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
