import { Box, Paper, Text, Title } from "@mantine/core";
import classes from "./page.module.css";

export default function AboutUs() {
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
            Hourly rate — $90/hr incl GST Please note an additional travel
            charge (Torbay is free) dependent on mileage.
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
        <Paper shadow="sm" radius="md" withBorder p="xl"></Paper>
        <Paper
          shadow="sm"
          radius="md"
          withBorder
          p="xl"
          className={classes.rateservice_services}
        ></Paper>
        <Paper
          shadow="sm"
          radius="md"
          withBorder
          p="xl"
          className={classes.rateservice_services}
        ></Paper>
      </Paper>
    </Box>
  );
}
