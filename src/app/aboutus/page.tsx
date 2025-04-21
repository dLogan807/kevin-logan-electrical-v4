import { Box, Button, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { IconCertificate } from "@tabler/icons-react";
import waiake from "@/assets/waiake.webp";
import { Metadata } from "next";
import { theme } from "@/components/theme";
import { Pages } from "@/components/layout/pages";
import getPageContent from "@/actions/mongodb/page_content_retrieval";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Find out more about Kevin Logan Electrical. Serving the North Shore community since 1992 and proud to be your local electrician of choice.",
};

export type AboutUsContent = {
  top_section: {
    text: string;
    button_text: string;
  };
  bottom_section: {
    text: string;
  };
};

export const fallbackContent: AboutUsContent = {
  top_section: {
    text: "I founded Kevin Logan Electrical in 1992 and have since been proudly serving the North Shore community. Based in Torbay, you can count on me as your local electrician.",
    button_text: "Registered Electrician",
  },
  bottom_section: {
    text: "I specialise in residential work, offering a competent and reliable electrical service you can count on. In addition, with my friendly and professional manner, I can answer any questions you may have about my business or services. I pride myself on quality workmanship and professional service from repairs and maintenance to installations. \n\n At Kevin Logan Electrical, my goal is to provide you with a courteous, prompt, professional service of the highest calibre.",
  },
};

export default async function AboutUs() {
  const mainSection: string = "main_section";

  var content: AboutUsContent | null = await getPageContent(Pages.AboutUs);

  if (!content) content = fallbackContent;

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, mainSection].join(" ")}
        withBorder
      >
        <Stack>
          <Text>{content.top_section.text}</Text>
          <Button
            leftSection={<IconCertificate aria-label="Certificate" />}
            component={Link}
            aria-label="Electrical Workers Registration Board website"
            href="https://kete.mbie.govt.nz/EW/EWPRSearch/practitioner/?id=efe7cde3-b142-df11-917a-005056ae567f"
          >
            {content.top_section.button_text}
          </Button>
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
