"use client";

import { Box } from "@mantine/core";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import classes from "./google_map.module.css";

//Card for services section of rate and services page
export default function GoogleMap({ query }: { query: string }) {
  const mapApiKey: string =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY == undefined
      ? ""
      : process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <Box className={classes.map}>
      {<GoogleMapsEmbed apiKey={mapApiKey} mode="place" q={query} />}
    </Box>
  );
}
