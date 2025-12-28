import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function Loading() {
  const mainSection = "main_section";

  return (
    <Box className={`${classes.rateservice_grid} content_grid`}>
      <Skeleton
        className={`${classes.rateservice_rate} ${mainSection}`}
      ></Skeleton>
      <Skeleton
        className={`${classes.rateservice_services} ${mainSection}`}
      ></Skeleton>
    </Box>
  );
}
