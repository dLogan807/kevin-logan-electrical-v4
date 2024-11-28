import { Button, Paper } from "@mantine/core";
import Link from "next/link";

import classes from "@/not-found.module.css";

export default function NotFound() {
  const mainSection: string = "main_section";

  return (
    <Paper className={[classes.container, mainSection].join(" ")} withBorder>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        Either the page you&apos;re looking for does not exist or has been
        moved.
      </p>
      <Link href="/">
        <Button>Go to Kevin Logan Electrical Home</Button>
      </Link>
    </Paper>
  );
}
