import { Box, Button, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { IconCertificate } from "@tabler/icons-react";
import waiake from "@/assets/waiake.webp";
import { Metadata } from "next";
import { theme } from "@/components/theme";
import { Pages } from "@/components/layout/pages";
import { unstable_cache } from "next/cache";
import {
  AboutUsFallback,
  AboutUsContent,
} from "@/actions/mongodb/pages/fallback_content";
import { getPageContent } from "@/actions/mongodb/pages/management";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Find out more about Kevin Logan Electrical. Serving the North Shore community since 1992 and proud to be your local electrician of choice.",
};

//Cache page content for 5 days
const getCachedPageContent = unstable_cache(
  async (): Promise<AboutUsContent> => {
    return await getPageContent(Pages.AboutUs, AboutUsFallback);
  },
  [Pages.AboutUs],
  { revalidate: 432000, tags: [Pages.AboutUs] }
);

export default async function AboutUs() {
  const mainSection: string = "main_section";

  const content: AboutUsContent = await getCachedPageContent();

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, mainSection].join(" ")}
        withBorder
      >
        <Stack>
          <Text>{content.top_section.text}</Text>
          <Link
            href="https://kete.mbie.govt.nz/EW/EWPRSearch/practitioner/?id=efe7cde3-b142-df11-917a-005056ae567f"
            aria-label="Electrical Workers Registration Board website"
          >
            <Button leftSection={<IconCertificate aria-label="Certificate" />}>
              {content.top_section.button_text}
            </Button>
          </Link>
        </Stack>
      </Paper>
      <Paper
        className={[classes.about_torbay, mainSection].join(" ")}
        withBorder
      >
        <Box>
          <Image
            src={waiake}
            alt="Waiake Beach"
            sizes={`(max-width: ${theme.breakpoints.xs}) 90vw, (max-width: ${theme.breakpoints.sm}) 50vw, (max-width: ${theme.breakpoints.md}) 100vw, (max-width: ${theme.breakpoints.xl}) 60vw`}
            priority
          />
        </Box>
      </Paper>
      <Paper
        className={[classes.about_text_2, mainSection].join(" ")}
        withBorder
      >
        <Text>{content.bottom_section.text}</Text>
      </Paper>
    </Box>
  );
}
