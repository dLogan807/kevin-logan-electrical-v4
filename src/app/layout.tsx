import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Box, mantineHtmlProps, Paper } from "@mantine/core";
import { headers } from "next/headers";
import { Providers } from "./components/layout/providers";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { connection } from "next/server";
import classes from "./layout.module.css";
import "./globals.css";
import { Footer } from "./components/layout/footer";
import { Navbar } from "./components/layout/navbar";

export const metadata: Metadata = {
  title: "Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Kevin Logan Electrical — providing the North Shore with a quality electrical service for over 30 years.",
  metadataBase: new URL("https://www.kevinloganelectrical.co.nz"),
  openGraph: {
    title: "Kevin Logan Electrical - Your Trusted Electrician",
    description:
      "Providing the North Shore with a quality electrical service for over 30 years.",
    type: "website",
    url: "https://www.kevinloganelectrical.co.nz",
    siteName: "Kevin Logan Electrical",
  },
};

export const instant = false;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head />
      <body className={classes.body}>
        <Suspense>
          <Providers nonce={nonce}>
            <Box className={classes.grid}>
              <Box></Box>
              <Paper className={classes.nav_container}>
                <Navbar />
              </Paper>
              <Box></Box>
              <Box></Box>
              <Box className={classes.content_container}>
                {children}
                <Footer />
              </Box>
            </Box>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
