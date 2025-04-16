import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import { IconBulb, IconSun, IconTool } from "@tabler/icons-react";
import { Metadata } from "next";
import { ServicesCard } from "@/components/services_card";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Rate & Services | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "I offer a wide range of residential services at Kevin Logan Electrical for an affordable rate of $90/hr incl GST.",
};

export default function RateAndServices() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.rateservice_grid, "content_grid"].join(" ")}>
      <Paper
        withBorder
        className={[classes.rateservice_rate, mainSection].join(" ")}
      >
        <div>
          <h4>Standard Rate</h4>
          <Text>
            Hourly rate — $90/hr incl. GST. Please note an additional travel
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
        <Stack>
          <h4>Services</h4>
          <Text>
            I offer a wide range of residential services. If you&apos;d like to
            inquire about a particular job, don&apos;t hesitate to give me a
            call.
          </Text>
          <Group className={classes.services_cards}>
            <ServicesCard
              headerIcon={<IconBulb />}
              headerText={"Interior"}
              listItems={[
                "Lighting",
                "Power Points",
                "Hot water faults",
                "Hood / Fan Installations",
                "Fault-finding",
              ]}
            ></ServicesCard>
            <ServicesCard
              headerIcon={<IconSun />}
              headerText={"Exterior"}
              listItems={[
                "Outdoor lighting / Sockets",
                "Garden lighting",
                "Security lights",
                "Swimming pools / Spa pools",
                "Sub mains to exterior buildings",
                "EV charge stations",
              ]}
            ></ServicesCard>
            <ServicesCard
              headerIcon={<IconTool />}
              headerText={"Renovations & Maintenance"}
              listItems={[
                "Switchboard upgrades",
                "Oven / Hob repairs",
                "Complete rewires",
                "Kitchens",
                "Bathrooms",
              ]}
            ></ServicesCard>
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}
