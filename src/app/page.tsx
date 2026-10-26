import {
  Box,
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { IconCircleCheck } from "@tabler/icons-react";
import tagline_image from "@/assets/tagline_background.webp";
import { theme } from "@/theme";
import GoogleMap from "@/components/google/GoogleMap/GoogleMap";
import GoogleReviewContainer from "@/components/google/GoogleReviewContainer/GoogleReviewContainer";
import { Pages } from "@/enums/pages";
import { HomeContent } from "@/types/pageContent";
import { getPageContent } from "@/actions/mongodb/pages/management";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

export default async function Home() {
  const mainSection = "main_section";

  const content = await getPageContent<HomeContent>(Pages.Home);

  return (
    <Box className={`${classes.home_grid} content_grid`}>
      <Paper className={`${classes.tagline} ${mainSection}`} withBorder>
        <Stack>
          <Title order={1}>{content.tagline.title}</Title>
          <Title order={2}>{content.tagline.subtitle}</Title>
          <Text>{content.tagline.description}</Text>
          <Link href="/contact-us" className={classes.contact_button}>
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
      <Paper className={`${classes.summary} ${mainSection}`} withBorder>
        <Title order={2}>{content.summary.title}</Title>
        <List
          icon={
            <ThemeIcon>
              <IconCircleCheck aria-hidden />
            </ThemeIcon>
          }
        >
          {content.summary.items.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </List>
      </Paper>
      <Paper
        className={`${classes.review_carousel_container} ${mainSection}`}
        withBorder
      >
        <GoogleReviewContainer
          query={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_QUERY}`}
          nameFilter={content.review_name_filter}
        />
      </Paper>
      <Paper className={`${classes.map} ${mainSection}`} withBorder>
        <GoogleMap
          query={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_QUERY}`}
        />
      </Paper>
    </Box>
  );
}
