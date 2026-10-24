"use client";

import {
  Anchor,
  Box,
  List,
  ListItem,
  Paper,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClockHour2,
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ContactForm } from "@/components/contact_form/contact_form";
import { ContactUsContent } from "@/actions/mongodb/pages/fallback_content";
import classes from "./ContactUsClient.module.css";
import TransparentThemeIcon from "@/components/icons/TransparentThemeIcon/TransparentThemeIcon";

type ContactUsClientProps = {
  content: ContactUsContent;
  nonce: string;
};

export default function ContactUsClient({
  content,
  nonce,
}: ContactUsClientProps) {
  const mainSection = "main_section";

  const mapIcon = (
    <TransparentThemeIcon>
      <IconMapPin aria-label="Location marker" />
    </TransparentThemeIcon>
  );
  const phoneIcon = (
    <TransparentThemeIcon>
      <IconPhone aria-label="Phone" />
    </TransparentThemeIcon>
  );
  const mobilePhoneIcon = (
    <TransparentThemeIcon>
      <IconDeviceMobile aria-label="Mobile phone" />
    </TransparentThemeIcon>
  );
  const emailIcon = (
    <TransparentThemeIcon>
      <IconMail aria-label="Email" />
    </TransparentThemeIcon>
  );
  const serviceHoursIcon = (
    <TransparentThemeIcon>
      <IconClockHour2 aria-label="Service hours" />
    </TransparentThemeIcon>
  );

  return (
    <ReCaptchaProvider
      className={classes.recaptcha}
      nonce={nonce}
      strategy="lazyOnload"
    >
      <Box className={`${classes.contactus_grid} content_grid`}>
        <Paper
          classNames={{ root: `${classes.contact_form} ${mainSection}` }}
          withBorder
        >
          <h4>Send an email</h4>
          <ContactForm />
        </Paper>
        <Paper
          classNames={{ root: `${classes.contact_details} ${mainSection}` }}
          withBorder
        >
          <Box className={classes.contact_details_box}>
            <h4>{content.contact_details.title}</h4>
            <List
              classNames={{
                root: classes.contact_details_list,
                item: classes.contact_details_list_label,
              }}
            >
              <ListItem icon={mapIcon}>
                {content.contact_details.location}
              </ListItem>
              <ListItem icon={phoneIcon}>
                <TelLink
                  phoneNumber={content.contact_details.phone}
                  isMobile={false}
                />
              </ListItem>
              <ListItem icon={mobilePhoneIcon}>
                <TelLink
                  phoneNumber={content.contact_details.mobile}
                  isMobile={true}
                />
              </ListItem>
              <ListItem icon={emailIcon}>
                <Anchor href={`mailto:${content.contact_details.email}`}>
                  {content.contact_details.email}
                </Anchor>
              </ListItem>
            </List>
          </Box>
          <Box className={classes.contact_details_box}>
            <h4>{content.service_hours.title}</h4>
            <List
              classNames={{
                root: classes.contact_details_list,
                item: classes.contact_details_list_label,
              }}
            >
              <ListItem icon={serviceHoursIcon}>
                <Text>{content.service_hours.hours}</Text>
                <Text>{content.service_hours.days}</Text>
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Box>
    </ReCaptchaProvider>
  );
}

type TelLinkProps = {
  phoneNumber: string;
  isMobile: boolean;
};

function TelLink({ phoneNumber, isMobile }: TelLinkProps) {
  const telHref = `tel:${isMobile ? "+64" : ""}${phoneNumber.split(" ").join("")}`;

  return <Anchor href={telHref}>{phoneNumber}</Anchor>;
}
