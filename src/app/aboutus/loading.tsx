import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function Loading() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.about_grid, "content_grid"].join(" ")}>
      <Skeleton
        className={[classes.about_text_1, mainSection].join(" ")}
      ></Skeleton>
      <Skeleton
        className={[classes.about_torbay, mainSection].join(" ")}
      ></Skeleton>
      <Skeleton
        className={[classes.about_text_2, mainSection].join(" ")}
      ></Skeleton>
    </Box>
  );
}
