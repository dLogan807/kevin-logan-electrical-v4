import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Box, Paper } from "@mantine/core";
import { Pages } from "@/components/layout/pages";
import PageSelector from "@/components/admin/page_selector";
import { getCurrentSession } from "@/actions/mongodb/sessions/cookie";
import { getStoredPageContent } from "@/actions/mongodb/pages/management";

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
  const { session } = await getCurrentSession();
  if (session === null) return redirect("/login");

  return (
    <Box className={"content_grid"}>
      <Paper className={"main_section"} withBorder>
        <PageSelector initialPromise={getStoredPageContent(Pages.Home)} />
      </Paper>
    </Box>
  );
}
