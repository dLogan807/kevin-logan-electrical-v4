import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default function Loading() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.rateservice_grid, "content_grid"].join(" ")}>
      <Skeleton
        className={[classes.rateservice_rate, mainSection].join(" ")}
      ></Skeleton>
      <Skeleton
        className={[classes.rateservice_services, mainSection].join(" ")}
      ></Skeleton>
    </Box>
  );
}
