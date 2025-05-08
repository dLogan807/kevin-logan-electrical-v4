import { Alert, Box, Paper } from "@mantine/core";
import { Metadata } from "next";
import PageSelector from "@/components/admin/page_selector";

import classes from "./page.module.css";
import { getStoredPageContent } from "@/actions/mongodb/db_handler";
import { Pages } from "@/components/layout/pages";
import { IconInfoCircle } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Admin | Kevin Logan Electrical - Your Trusted Electrician",
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

export default function Admin() {
  const infoIcon = <IconInfoCircle />;

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, "main_section"].join(" ")}
        withBorder
      >
        <h1 className={classes.heading}>Content Management</h1>
        <Alert variant="light" title="Submission" icon={infoIcon}>
          After submission, it may take up to 5 days to become live on the
          website. However, the latest content will always be retrieved here.
        </Alert>
        <PageSelector initialPromise={getStoredPageContent(Pages.Home)} />
      </Paper>
    </Box>
  );
}
