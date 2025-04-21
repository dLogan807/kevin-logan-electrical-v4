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
import GoogleReviewContainer from "./components/google_reviews/google_review_container";
import getPageContent from "@/utils/page_content/page_content_retrieval";
import { Pages } from "./components/layout/pages";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

export type HomeContent = {
  tagline: {
    title: string;
    subtitle: string;
    description: string;
    button_text: string;
  };
  summary: {
    title: string;
    items: string[];
  };
  review_name_filter: string[];
};

export const fallbackContent: HomeContent = {
  tagline: {
    title: "Your Trusted Local Electrician",
    subtitle: "30 years of experience you can rely on",
    description:
      "At Kevin Logan Electrical, we believe in providing a competent, professional, and courteous electrical service. Striving to give you results of the highest quality is at our forefront.",
    button_text: "Get in touch",
  },
  summary: {
    title: "Our Service",
    items: [
      "Based in Torbay, North Shore",
      "Professional, Friendly & Approachable",
      "Wide Range of Residential Services",
      "Affordable $90/hr incl. GST",
      "Independent",
      "Committed to Sustainability",
      "Satisfaction Guaranteed",
    ],
  },
  review_name_filter: [],
};

export default async function Home() {
  const mainSection: string = "main_section";

  var content: HomeContent | null = await getPageContent(Pages.Home);

  if (!content) content = fallbackContent;

  return (
    <Box className={[classes.home_grid, "content_grid"].join(" ")}>
      <Paper className={[classes.tagline, mainSection].join(" ")} withBorder>
        <Stack>
          <h1>{content.tagline.title}</h1>
          <h2>{content.tagline.subtitle}</h2>
          <Text>{content.tagline.description}</Text>
          <Link href="/contactus" className={classes.contact_button}>
            <Button>{content.tagline.button_text}</Button>
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
        <h2>{content.summary.title}</h2>
        <List
          icon={
            <ThemeIcon className={"checkmark"}>
              <IconCircleCheck />
            </ThemeIcon>
          }
        >
          {content.summary.items.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </List>
      </Paper>
      <Paper
        className={[classes.review_carousel_container, mainSection].join(" ")}
        withBorder
      >
        <GoogleReviewContainer
          query={"" + process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_QUERY}
          nameFilter={content.review_name_filter}
        />
      </Paper>
      <Paper className={[classes.map, mainSection].join(" ")} withBorder>
        <GoogleMap
          query={"" + process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_QUERY}
        />
      </Paper>
    </Box>
  );
}
