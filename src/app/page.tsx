import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { IconCircleCheck } from "@tabler/icons-react";
import tagline_image from "@/assets/tagline_background.webp";
import { theme } from "@/components/theme";
import GoogleMap from "./components/google_map/google_map";
import GoogleReviewCarousel from "./components/google_reviews/google_review_carousel";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

export default function Home() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.home_grid, "content_grid"].join(" ")}>
      <Paper className={[classes.tagline, mainSection].join(" ")} withBorder>
        <Stack>
          <h1>Your Trusted Local Electrician</h1>
          <h2>30 years of experience you can rely on</h2>
          <Text>
            At Kevin Logan Electrical, we believe in providing a competent,
            professional, and courteous electrical service. Striving to give you
            results of the highest quality is at our forefront.
          </Text>
          <Link href="/contactus" className={classes.contact_button}>
            <Button>Get in touch</Button>
          </Link>
        </Stack>
      </Paper>
      <Box className={classes.tagline_image_container}>
        <Box>
          <Image
            alt="House interior with lamp"
            src={tagline_image}
            fill
            sizes={`(max-width: ${theme.breakpoints.sm}) 80vw, (max-width: ${theme.breakpoints.md}) 50vw, (max-width: ${theme.breakpoints.xl}) 40vw`}
            priority
          />
        </Box>
      </Box>
      <Paper className={[classes.summary, mainSection].join(" ")} withBorder>
        <h2>Our Service</h2>
        <List
          icon={
            <ThemeIcon className={"checkmark"}>
              <IconCircleCheck />
            </ThemeIcon>
          }
        >
          <ListItem>Based in Torbay, North Shore</ListItem>
          <ListItem>Professional, Friendly & Approachable</ListItem>
          <ListItem>Wide Range of Residential Services</ListItem>
          <ListItem>Affordable $90/hr incl. GST</ListItem>
          <ListItem>Independent</ListItem>
          <ListItem>Committed to Sustainability</ListItem>
          <ListItem>Satisfaction Guaranteed</ListItem>
        </List>
      </Paper>
      <Paper
        className={[classes.review_carousel_container, mainSection].join(" ")}
        withBorder
      >
        <GoogleReviewCarousel />
      </Paper>
      <Paper className={[classes.map, mainSection].join(" ")} withBorder>
        <GoogleMap query="Kevin Logan Electrical, Torbay, Auckland" />
      </Paper>
    </Box>
  );
}
