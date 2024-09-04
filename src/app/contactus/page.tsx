import { Box, List, ListItem, Paper, Text, ThemeIcon } from "@mantine/core";
import { Metadata } from "next";
import classes from "./page.module.css";
import {
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Contact Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Contact Kevin Logan Electrical. Open Monday to Friday, don't hesitate to give me call for expedient service of the highest calibre.",
};

export default function ContactUs() {
  const mainSection: string = "main_section";

  return (
    <Box className={classes.contactus_grid}>
      <Paper
        className={[classes.contact_form, mainSection].join(" ")}
        withBorder
      ></Paper>
      <Paper
        className={[classes.contact_details, mainSection].join(" ")}
        withBorder
      >
        <h4>Contact Details</h4>
        <List>
          <ListItem
            icon={
              <ThemeIcon className={"list_icon"}>
                <IconMapPin />
              </ThemeIcon>
            }
          >
            Based in Torbay, North Shore
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon className={"list_icon"}>
                <IconPhone />
              </ThemeIcon>
            }
          >
            (09) 473 9712
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon className={"list_icon"}>
                <IconDeviceMobile />
              </ThemeIcon>
            }
          >
            0274 978 473
          </ListItem>
          <ListItem
            icon={
              <ThemeIcon className={"list_icon"}>
                <IconMail />
              </ThemeIcon>
            }
          >
            kevinlog@kevinloganelectrical.co.nz
          </ListItem>
        </List>
        <h4>Service Hours</h4>
        <Text>8 AM - 5 PM</Text>
        <Text>Monday - Friday</Text>
      </Paper>
    </Box>
  );
}
