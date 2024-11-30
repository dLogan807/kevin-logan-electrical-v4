import { Button, Paper, Text, Box } from "@mantine/core";
import Link from "next/link";

import classes from "@/not-found.module.css";

export default function NotFound() {
  const mainSection: string = "main_section";

  return (
    <Box className={[classes.notfound_grid, "content_grid"].join(" ")}>
      <Paper className={[classes.container, mainSection].join(" ")} withBorder>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <Text className={classes.explanation}>
          Either the page you&apos;re looking for does not exist or has been
          moved.
        </Text>
        <Link href="/" className={classes.home_button}>
          <Button>Go to Kevin Logan Electrical Home</Button>
        </Link>
      </Paper>
    </Box>
  );
}
