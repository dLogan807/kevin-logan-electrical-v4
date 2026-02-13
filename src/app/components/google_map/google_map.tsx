"use server";

import { Box } from "@mantine/core";
import { GoogleMapsEmbed } from "@next/third-parties/google";
import classes from "./google_map.module.css";

export default async function GoogleMap({ query }: { query: string }) {
  const mapApiKey = `${process.env.GOOGLE_MAPS_API_KEY}`;

  if (!query || !mapApiKey || process.env.NODE_ENV === "development") {
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
