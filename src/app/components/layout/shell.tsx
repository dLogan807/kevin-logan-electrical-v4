import { ReactNode } from "react";
import { ColorSchemeScript, Box, Paper } from "@mantine/core";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { headers } from "next/headers";
import classes from "./shell.module.css";

export async function Shell({ children }: { children: ReactNode }) {
  const nonce = (await headers()).get("x-nonce") || "";

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" nonce={nonce} />
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
    </>
  );
}
