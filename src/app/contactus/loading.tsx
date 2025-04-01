import { Box, Skeleton } from "@mantine/core";
import classes from "./loading.module.css";

export default async function Loading() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.contactus_grid, "content_grid"].join(" ")}>
      <Skeleton
        className={[classes.contact_form, mainSection].join(" ")}
      ></Skeleton>
      <Skeleton
        className={[classes.contact_details, mainSection].join(" ")}
      ></Skeleton>
    </Box>
  );
}
