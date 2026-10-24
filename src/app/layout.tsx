import { ReactNode } from "react";
import type { Metadata } from "next";
import { Box, ColorSchemeScript, mantineHtmlProps, Paper } from "@mantine/core";
import { headers } from "next/headers";
import { Providers } from "@/components/providers/Providers/Providers";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import classes from "./layout.module.css";
import "./globals.css";

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

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          nonce={nonce}
        />
      </head>
      <body className={classes.body}>
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
      </body>
    </html>
  );
}
