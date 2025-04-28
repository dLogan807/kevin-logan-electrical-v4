"use server";

import { Box } from "@mantine/core";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import classes from "./google_map.module.css";

//Card for services section of rate and services page
export default async function GoogleMap({ query }: { query: string }) {
  const mapApiKey: string =
    process.env.GOOGLE_MAPS_API_KEY == undefined
      ? ""
      : process.env.GOOGLE_MAPS_API_KEY;

  if (!query || !mapApiKey) {
    return <Box className={classes.map}>Could not load map.</Box>;
  }

  return (
    <Box className={classes.map}>
      {
        <GoogleMapsEmbed
          apiKey={mapApiKey}
          mode="place"
          q={query}
          zoom={"15"}
        />
      }
    </Box>
  );
}
