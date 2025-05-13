import { Box, Paper } from "@mantine/core";
import { Metadata } from "next";
import PageSelector from "@/components/admin/page_selector";

import classes from "./page.module.css";
import { getStoredPageContent } from "@/actions/mongodb/pages";
import { Pages } from "@/components/layout/pages";

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
  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Paper
        className={[classes.about_text_1, "main_section"].join(" ")}
        withBorder
      >
        <h1 className={classes.heading}>Content Management</h1>
        <PageSelector initialPromise={getStoredPageContent(Pages.Home)} />
      </Paper>
    </Box>
  );
}
