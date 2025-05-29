import { Box, Paper } from "@mantine/core";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import PageSelector from "@/components/admin/page_selector";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookies";
import { getStoredPageContent } from "@/actions/mongodb/pages/page_management";
import { Pages } from "@/components/layout/pages";
import classes from "./page.module.css";

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

export default async function Admin() {
  const { user } = await getCurrentSession();
  if (user === null) {
    return redirect("/");
  }

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
