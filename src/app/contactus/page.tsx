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
import { ContactForm } from "@/components/contact_form/contact_form";
import { headers } from "next/headers";
import { Pages } from "@/components/layout/pages";
import { unstable_cache } from "next/cache";
import { getPageContent } from "@/actions/mongodb/db_handler";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Contact Kevin Logan Electrical. Open Monday to Friday, don't hesitate to give me call for a reliable service of the highest calibre.",
};

export type ContactUsContent = {
  contact_details: {
    title: string;
    location: string;
    phone: string;
    mobile: string;
    email: string;
  };
  service_hours: {
    title: string;
    hours: string;
    days: string;
  };
};

export const fallbackContent: ContactUsContent = {
  contact_details: {
    title: "Contact Details",
    location: "Based in Torbay, servicing the North Shore",
    phone: "09 473 9712",
    mobile: "0274 978 473",
    email: "kevinlog@kevinloganelectrical.co.nz",
  },
  service_hours: {
    title: "Service Hours",
    hours: "8 AM - 5 PM",
    days: "Monday - Friday",
  },
};

//Cache page content for 5 days
const getCachedPageContent = unstable_cache(
  async (): Promise<ContactUsContent> => {
    return (await getPageContent(
      Pages.ContactUs,
      fallbackContent
    )) as ContactUsContent;
  },
  [Pages.ContactUs],
  { revalidate: 432000, tags: [Pages.ContactUs] }
);

export default async function ContactUs() {
  const mainSection: string = "main_section";

  const nonce: string = await headers()
    .then((headers) => headers.get("x-nonce"))
    .then((rawNonce) => {
      return rawNonce == undefined ? "" : rawNonce;
    });

  const content: ContactUsContent = await getCachedPageContent();

  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
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
          <h4>{content.contact_details.title}</h4>
          <List>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconMapPin aria-label="Location marker icon" />
                </ThemeIcon>
              }
            >
              {content.contact_details.location}
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconPhone aria-label="Phone icon" />
                </ThemeIcon>
              }
            >
              <Anchor
                href={`tel:${content.contact_details.phone.split(" ").join("")}`}
              >
                {content.contact_details.phone}
              </Anchor>
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconDeviceMobile aria-label="Mobile phone icon" />
                </ThemeIcon>
              }
            >
              <Anchor
                href={`tel:+64${content.contact_details.mobile.split(" ").join("")}`}
              >
                {content.contact_details.mobile}
              </Anchor>
            </ListItem>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconMail aria-label="Letter icon" />
                </ThemeIcon>
              }
            >
              <Anchor href={`mailto:${content.contact_details.email}`}>
                {content.contact_details.email}
              </Anchor>
            </ListItem>
          </List>
          <h4>{content.service_hours.title}</h4>
          <List>
            <ListItem
              icon={
                <ThemeIcon className={"list_icon"}>
                  <IconClockHour2 aria-label="Analogue clock icon" />
                </ThemeIcon>
              }
            >
              <Text>{content.service_hours.hours}</Text>
              <Text>{content.service_hours.days}</Text>
            </ListItem>
          </List>
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}
