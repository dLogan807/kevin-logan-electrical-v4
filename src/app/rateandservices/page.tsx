import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconBulb, IconSun, IconTool } from "@tabler/icons-react";
import { Metadata } from "next";
import { ServicesCard } from "@/components/services_card/services_card";
import { Pages } from "@/enums/pages";
import { RateAndServicesContent } from "@/actions/mongodb/pages/fallback_content";
import { getPageContent } from "@/actions/mongodb/pages/management";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Rate & Services | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "I offer a wide range of residential services at Kevin Logan Electrical for an affordable rate of $90/hr incl GST.",
};

export default async function RateAndServices() {
  const mainSection = "main_section";

  const content = await getPageContent<RateAndServicesContent>(
    Pages.RateAndServices,
  );

  return (
    <Box className={`${classes.rateservice_grid} content_grid`}>
      <Paper
        withBorder
        classNames={{ root: `${classes.rateservice_rate} ${mainSection}` }}
      >
        <div>
          <Title order={4}>{content.rate.title}</Title>
          <Text>{content.rate.text}</Text>
        </div>
        <div>
          <Title order={4}>{content.estimates.title}</Title>
          <Text>{content.estimates.text}</Text>
        </div>
      </Paper>
      <Paper
        classNames={{ root: `${classes.rateservice_services} ${mainSection}` }}
        withBorder
      >
        <Stack>
          <Title order={4}>{content.services.title}</Title>
          <Text>{content.services.description}</Text>
          <Group classNames={{ root: classes.services_cards }}>
            <ServicesCard
              headerIcon={<IconBulb />}
              headerText={"Interior"}
              listItems={content.services.categories.interior}
            />
            <ServicesCard
              headerIcon={<IconSun />}
              headerText={"Exterior"}
              listItems={content.services.categories.exterior}
            />
            <ServicesCard
              headerIcon={<IconTool />}
              headerText={"Renovations & Maintenance"}
              listItems={
                content.services.categories.renovations_and_maintenance
              }
            />
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}
