import { Metadata } from "next";
import { Pages } from "@/enums/pages";
import { getPageContent } from "@/actions/mongodb/pages/management";
import { ContactUsContent } from "@/types/pageContent";
import { Anchor, Box, List, ListItem, Paper, Text, Title } from "@mantine/core";
import { ContactForm } from "@/components/forms/ContactForm/ContactForm";
import TransparentThemeIcon from "@/components/icons/TransparentThemeIcon/TransparentThemeIcon";
import {
  IconMapPin,
  IconPhone,
  IconDeviceMobile,
  IconMail,
  IconClockHour2,
} from "@tabler/icons-react";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Contact Kevin Logan Electrical. Open Monday to Friday, don't hesitate to give me call for a reliable service of the highest calibre.",
};

export default async function ContactUs() {
  const content = await getPageContent<ContactUsContent>(Pages.ContactUs);

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
    <Box className={`${classes.contactus_grid} content_grid`}>
      <Paper
        classNames={{ root: `${classes.contact_form} ${mainSection}` }}
        withBorder
      >
        <Title order={2}>Send an email</Title>
        <ContactForm />
      </Paper>
      <Paper
        classNames={{ root: `${classes.contact_details} ${mainSection}` }}
        withBorder
      >
        <Box className={classes.contact_details_box}>
          <Title order={2}>{content.contact_details.title}</Title>
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
          <Title order={2}>{content.service_hours.title}</Title>
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
