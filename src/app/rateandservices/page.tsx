import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import { IconBulb, IconSun, IconTool } from "@tabler/icons-react";
import { Metadata } from "next";
import { ServicesCard } from "@/components/services_card/services_card";
import { Pages } from "@/components/layout/pages";
import { unstable_cache } from "next/cache";
import { getPageContent } from "@/actions/mongodb/pages/page_management";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Rate & Services | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "I offer a wide range of residential services at Kevin Logan Electrical for an affordable rate of $90/hr incl GST.",
};

export type RateAndServicesContent = {
  rate: {
    title: string;
    text: string;
  };
  estimates: {
    title: string;
    text: string;
  };
  services: {
    title: string;
    description: string;
    categories: {
      interior: string[];
      exterior: string[];
      renovations_and_maintenance: string[];
    };
  };
};

export const fallbackContent: RateAndServicesContent = {
  rate: {
    title: "Standard Rate",
    text: "Hourly rate — $90/hr incl. GST. Please note an additional travel charge dependent on mileage.",
  },
  estimates: {
    title: "Estimates",
    text: "Please call if you would like an estimate on the cost of a job. Often the price indicated over the phone is very close to the actual cost of the job. When the job is complete, an itemised invoice is given listing the materials used plus additional labour costs.",
  },
  services: {
    title: "Services",
    description:
      "I offer a wide range of residential services. If you'd like to inquire about a particular job, don't hesitate to give me a call.",
    categories: {
      interior: [
        "Lighting",
        "Powerpoints",
        "Hot water faults",
        "Hood / Fan installations",
        "Fault-finding",
      ],
      exterior: [
        "Outdoor lighting / Sockets",
        "Garden lighting",
        "Security lights",
        "Swimming pools / Spa pools",
        "Sub mains to exterior buildings",
        "EV charge stations",
      ],
      renovations_and_maintenance: [
        "Switchboard upgrades",
        "Oven / Hob repairs",
        "Complete rewires",
        "Kitchens",
        "Bathrooms",
      ],
    },
  },
};

//Cache page content for 5 days
const getCachedPageContent = unstable_cache(
  async (): Promise<RateAndServicesContent> => {
    return (await getPageContent(
      Pages.RateAndServices,
      fallbackContent
    )) as RateAndServicesContent;
  },
  [Pages.RateAndServices],
  { revalidate: 432000, tags: [Pages.RateAndServices] }
);

export default async function RateAndServices() {
  const mainSection: string = "main_section";

  const content: RateAndServicesContent = await getCachedPageContent();

  return (
    <Box className={[classes.rateservice_grid, "content_grid"].join(" ")}>
      <Paper
        withBorder
        className={[classes.rateservice_rate, mainSection].join(" ")}
      >
        <div>
          <h4>{content.rate.title}</h4>
          <Text>{content.rate.text}</Text>
        </div>
        <div>
          <h4>{content.estimates.title}</h4>
          <Text>{content.estimates.text}</Text>
        </div>
      </Paper>
      <Paper
        className={[classes.rateservice_services, mainSection].join(" ")}
        withBorder
      >
        <Stack>
          <h4>{content.services.title}</h4>
          <Text>{content.services.description}</Text>
          <Group className={classes.services_cards}>
            <ServicesCard
              headerIcon={<IconBulb />}
              headerText={"Interior"}
              listItems={content.services.categories.interior}
            ></ServicesCard>
            <ServicesCard
              headerIcon={<IconSun />}
              headerText={"Exterior"}
              listItems={content.services.categories.exterior}
            ></ServicesCard>
            <ServicesCard
              headerIcon={<IconTool />}
              headerText={"Renovations & Maintenance"}
              listItems={
                content.services.categories.renovations_and_maintenance
              }
            ></ServicesCard>
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}
