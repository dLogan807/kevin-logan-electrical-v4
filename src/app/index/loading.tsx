import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function Loading() {
  const mainSection: string = "main_section";
  return (
    <Box className={[classes.home_grid, "content_grid"].join(" ")}>
      <Skeleton className={[classes.tagline, mainSection].join(" ")}></Skeleton>
      <Skeleton className={[classes.summary, mainSection].join(" ")}></Skeleton>
      <Skeleton className={[classes.review, mainSection].join(" ")}></Skeleton>
      <Skeleton className={[classes.map, mainSection].join(" ")}></Skeleton>
    </Box>
  );
}
