import { Button } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import classes from "./ReviewButton.module.css";

export default function ReviewButton() {
  return (
    <Link
      target="_blank"
      href="https://www.google.com/search?q=kevin+logan+electrical"
    >
      <Button
        variant="light"
        rightSection={<IconArrowRight aria-label="Right arrow" />}
        classNames={{ root: classes.review_button_root }}
      >
        Review
      </Button>
    </Link>
  );
}
