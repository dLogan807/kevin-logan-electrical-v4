import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";

import { mantineHtmlProps } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import classes from "./layout.module.css";
import "./globals.css";
import { Shell } from "./components/layout/shell";

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

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head />
      <body className={classes.body}>
        <Suspense>
          <Shell>{children}</Shell>
        </Suspense>
      </body>
    </html>
  );
}
