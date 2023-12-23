import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function AboutUsLoading() {
  return (
    <Box className={classes.about_grid}>
      <Skeleton animate={false} radius="md" className={classes.ewrb}></Skeleton>
      <Skeleton
        animate={false}
        radius="md"
        className={classes.about_text_1}
      ></Skeleton>
      <Skeleton
        animate={false}
        radius="md"
        className={classes.about_text_2}
      ></Skeleton>
      <Skeleton
        animate={false}
        radius="md"
        className={classes.about_torbay}
      ></Skeleton>
    </Box>
  );
}
