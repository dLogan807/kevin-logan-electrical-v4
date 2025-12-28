import { Box, Skeleton } from "@mantine/core";
import classes from "./home_loading.module.css";

export default function HomeLoading() {
  const mainSection = "main_section";

  return (
    <Box className={`${classes.home_grid} content_grid`}>
      <Skeleton className={`${classes.tagline} ${mainSection}`}></Skeleton>
      <Box className={classes.tagline_image_container}></Box>
      <Skeleton className={`${classes.summary} ${mainSection}`}></Skeleton>
      <Skeleton
        className={`${classes.review_carousel_container} ${mainSection}`}
      ></Skeleton>
      <Skeleton className={`${classes.map} ${mainSection}`}></Skeleton>
    </Box>
  );
}
