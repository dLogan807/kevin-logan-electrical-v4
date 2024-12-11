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
import { headers } from "next/headers";
import { IconCircleCheck } from "@tabler/icons-react";

import classes from "./page.module.css";
import tagline_image from "@/assets/tagline_background.webp";
import { theme } from "@/components/theme";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
};

export default async function Home() {
  const mainSection: string = "main_section";
  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => {
      return rawNonce == undefined ? "" : rawNonce;
    });

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
      <Paper className={[classes.review, mainSection].join(" ")} withBorder>
        <h3>Leave a Review</h3>
        <Link
          href="https://www.google.com/search?q=kevin+logan+electrical"
          className={classes.review_button}
        >
          <Button>Review</Button>
        </Link>
      </Paper>
      <Paper className={[classes.map, mainSection].join(" ")} withBorder>
        <Box>
          <iframe
            title="Kevin Logan Electrical Map"
            allowFullScreen={false}
            nonce={nonce}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.0824953009924!2d174.75661361526056!3d-36.696555478713236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d3b0bb3a49f7d%3A0x91ebdb4ffbccde12!2sKevin%20Logan%20Electrical!5e0!3m2!1sen!2snz!4v1641444320071!5m2!1sen!2snz"
          ></iframe>
        </Box>
      </Paper>
    </Box>
  );
}
