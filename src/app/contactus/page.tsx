import {
  Anchor,
  Box,
  List,
  ListItem,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Metadata } from "next";
import {
  IconClockHour2,
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ContactForm } from "@/components/contact_form";

import classes from "./page.module.css";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Contact Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Contact Kevin Logan Electrical. Open Monday to Friday, don't hesitate to give me call for a reliable service of the highest calibre.",
};

export default async function ContactUs() {
  const mainSection: string = "main_section";

  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => {
      return rawNonce == undefined ? "" : rawNonce;
    });

  return (
    <ReCaptchaProvider className={classes.recaptcha} nonce={nonce}>
      <Box className={[classes.contactus_grid, "content_grid"].join(" ")}>
        <Paper
          className={[classes.contact_form, mainSection].join(" ")}
          withBorder
        >
          <h4>Send an email</h4>
          <ContactForm />
        </Paper>
        <Paper
          className={[classes.contact_details, mainSection].join(" ")}
          withBorder
        >
          <h4>Contact Details</h4>
          <List>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconMapPin aria-label="Location marker icon" />
                </ThemeIcon>
              }
            >
              Based in Torbay, servicing the North Shore
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconPhone aria-label="Phone icon" />
                </ThemeIcon>
              }
            >
              <Anchor href="tel:094739712">09 473 9712</Anchor>
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconDeviceMobile aria-label="Mobile phone icon" />
                </ThemeIcon>
              }
            >
              <Anchor href="tel:+64274978473">0274 978 473</Anchor>
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconMail aria-label="Letter icon" />
                </ThemeIcon>
              }
            >
              <Anchor href="mailto:kevinlog@kevinloganelectrical.co.nz">
                kevinlog@kevinloganelectrical.co.nz
              </Anchor>
            </ListItem>
          </List>
          <h4>Service Hours</h4>
          <List>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconClockHour2 aria-label="Analogue clock icon" />
                </ThemeIcon>
              }
            >
              <Text>8 AM - 5 PM</Text>
              <Text>Monday - Friday</Text>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}
