import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Box, Paper } from "@mantine/core";
import { Pages } from "@/app/enums/pages";
import { getCurrentSession } from "@/app/actions/mongodb/sessions/cookie";
import { getStoredPageContent } from "@/app/actions/mongodb/pages/management";
import PageFormSelector from "@/app/components/admin/page_form_selector";

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

  const initialPage = Pages.Home;
  const initialContentPromise = getStoredPageContent(initialPage);

  return (
    <Box className={"content_grid"}>
      <Paper className={"main_section"} withBorder>
        <PageFormSelector
          initialContentPromise={initialContentPromise}
          initialPage={initialPage}
        />
      </Paper>
    </Box>
  );
}
