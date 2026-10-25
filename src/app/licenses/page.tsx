import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Metadata } from "next";
import licenses from "@/generated/licenses.json";
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

type License = {
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

const typedLicenses = licenses as License[];

export default function Licenses() {
  return (
    <Box className={"content_grid"}>
      <Paper className={`${classes.licenses_paper} main_section`} withBorder>
        <Box className={classes.licenses_header}>
          <Title order={1}>Open Source Licenses</Title>
          <Text>
            The following open source libraries were used in the making of this
            website
          </Text>
        </Box>

        <Box className={classes.licenses_box}>
          {typedLicenses.map((license) => (
            <Link
              key={license.name}
              href={license.link.replace("git+", "").replace("ssh://", "")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open Github repository for ${license.name}`}
              className={classes.package_link}
            >
              <Button variant="outline" className={classes.licenses_button}>
                <Box className={classes.license_button_box}>
                  <p>{`${license.name} ${license.installedVersion}`}</p>
                  <p>{`License: ${license.licenseType}`}</p>
                  <ThemeIcon classNames={{ root: classes.license_link_icon }}>
                    <IconExternalLink aria-label="External website link" />
                  </ThemeIcon>
                </Box>
              </Button>
            </Link>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
