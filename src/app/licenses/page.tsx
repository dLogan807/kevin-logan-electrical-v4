import React from "react";
import { IconExternalLink } from "@tabler/icons-react";
import { Anchor, Box, Group, Paper, Stack, ThemeIcon } from "@mantine/core";
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
          <h2>All licenses for software used in this website</h2>
        </Stack>
        <Stack gap="xl">
          {licenses.map((l) => (
            <Anchor
              key={l.name}
              href={l.link.replace("git+", "").replace("ssh://", "")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Github repo for ${l.name}`}
            >
              <Stack gap="xs">
                <Group>
                  <span>{l.name + " " + l.installedVersion}</span>

                  <ThemeIcon className={"checkmark"}>
                    <IconExternalLink aria-label="Open external Github" />
                  </ThemeIcon>
                </Group>

                <Box>
                  {[l.licenseType, l.author].filter(Boolean).join(", ")}
                </Box>
              </Stack>
            </Anchor>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
