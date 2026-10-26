import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function Loading() {
  const mainSection = "main_section";

  return (
    <Box className={`${classes.about_grid} content_grid`}>
      <Skeleton className={`${classes.about_text_1} ${mainSection}`}></Skeleton>
      <Skeleton className={`${classes.about_torbay} ${mainSection}`}></Skeleton>
      <Skeleton className={`${classes.about_text_2} ${mainSection}`}></Skeleton>
    </Box>
  );
}
