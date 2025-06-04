import React from "react";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Box, Button, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { Metadata } from "next";
import licensesJSON from "../../../licenses.json";
import classes from "./page.module.css";

export const metadata: Metadata = {
  title: "Licenses | Kevin Logan Electrical - Your Trusted Electrician",
  description: "Licenses for software used in this website.",
  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
};

type LicenseFormat = {
  department: string;
  relatedTo: string;
  name: string;
  licensePeriod: string;
  material: string;
  licenseType: string;
  link: string;
  remoteVersion: string;
  installedVersion: string;
  definedVersion: string;
  author: string;
};

export default function Licenses() {
  const licenses = licensesJSON as LicenseFormat[];

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, "main_section"].join(" ")}
        withBorder
      >
        <Stack className={classes.heading}>
          <h1>Open Source Licenses</h1>
          <Text>
            The following open source libraries were used in the making of this
            website
          </Text>
        </Stack>
        <Stack gap="lg">
          {licenses.map((p) => (
            <Link
              key={p.name}
              href={p.link.replace("git+", "").replace("ssh://", "")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Github repository for ${p.name}`}
              className={classes.package_link}
            >
              <Button variant="outline">
                <Box className={classes.info_container}>
                  <p>{p.name + " " + p.installedVersion}</p>
                  <p>{"License: " + p.licenseType}</p>
                  <ThemeIcon
                    className={["checkmark", classes.link_icon].join(" ")}
                  >
                    <IconExternalLink aria-label="External website link" />
                  </ThemeIcon>
                </Box>
              </Button>
            </Link>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
