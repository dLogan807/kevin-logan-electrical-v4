import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default async function Loading() {
  const mainSection = "main_section";

  return (
    <Box className={`${classes.contactus_grid} content_grid`}>
      <Skeleton className={`${classes.contact_form} ${mainSection}`}></Skeleton>
      <Skeleton
        className={`${classes.contact_details} ${mainSection}`}
      ></Skeleton>
    </Box>
  );
}
