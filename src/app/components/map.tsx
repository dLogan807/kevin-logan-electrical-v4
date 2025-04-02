"use client";

import { Box } from "@mantine/core";
import classes from "./map.module.css";

//Card for services section of rate and services page
export default function Map({ nonce }: { nonce: string }) {
  return (
    <Box className={classes.map}>
      <iframe
        title="Kevin Logan Electrical Map"
        allowFullScreen={false}
        nonce={nonce}
        rel="preconnect"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3199.0824953009924!2d174.75661361526056!3d-36.696555478713236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d3b0bb3a49f7d%3A0x91ebdb4ffbccde12!2sKevin%20Logan%20Electrical!5e0!3m2!1sen!2snz!4v1641444320071!5m2!1sen!2snz"
      ></iframe>
    </Box>
  );
}
