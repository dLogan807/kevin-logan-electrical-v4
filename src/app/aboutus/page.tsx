import { Box, Button, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { IconCertificate } from "@tabler/icons-react";
import waiake from "@/assets/waiake.webp";
import { Metadata } from "next";
import { theme } from "@/components/theme";
import { connectToMongoDB } from "../actions/mongodb/connect";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Find out more about Kevin Logan Electrical. Serving the North Shore community since 1992 and proud to be your local electrician of choice.",
};

export default async function AboutUs() {
  const mainSection: string = "main_section";

  await connectToMongoDB();

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, mainSection].join(" ")}
        withBorder
      >
        <Stack>
          <Text>
            I founded Kevin Logan Electrical in 1992 and have since been proudly
            serving the North Shore community. Based in Torbay, you can count on
            me as your local electrician.
          </Text>
          <Button
            leftSection={<IconCertificate aria-label="Certificate" />}
            component={Link}
            aria-label="Electrical Workers Registration Board website"
            href="https://kete.mbie.govt.nz/EW/EWPRSearch/practitioner/?id=efe7cde3-b142-df11-917a-005056ae567f"
          >
            Registered Electrician
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
        <Text>
          I specialise in residential work, offering a competent and reliable
          electrical service you can count on. In addition, with my friendly and
          professional manner, I can answer any questions you may have about my
          business or services. I pride myself on quality workmanship and
          professional service from repairs and maintenance to installations.
          <br />
          <br />
          At Kevin Logan Electrical, my goal is to provide you with a courteous,
          prompt, professional service of the highest calibre.
        </Text>
      </Paper>
    </Box>
  );
}
