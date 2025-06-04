import {
  IconArrowRight,
  IconBrandGoogle,
  IconStarFilled,
} from "@tabler/icons-react";
import { Box, Button, Group, Rating, Text, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import {
  getGoogleReviews,
  GoogleReviews,
} from "@/actions/google_reviews/get_reviews";
import GoogleReviewCarousel from "./carousel";
import classes from "./google_review_container.module.css";

function ReviewButton() {
  return (
    <Link
      href="https://www.google.com/search?q=kevin+logan+electrical"
      className={classes.review_button}
    >
      <Button variant="light">
        <Group>
          <Text>Review</Text>
          <IconArrowRight aria-label="Right arrow" />
        </Group>
      </Button>
    </Link>
  );
}

function NoReviewsPrompt() {
  return (
    <Group className={classes.no_reviews_prompt}>
      <Text>Had work done? Consider leaving a review!</Text>
      {ReviewButton()}
    </Group>
  );
}

export default async function GoogleReviewContainer({
  query,
  nameFilter,
}: {
  query: string;
  nameFilter: string[];
}) {
  const googleReviews: GoogleReviews | null = query
    ? await getGoogleReviews(query, nameFilter)
    : null;

  if (
    !googleReviews ||
    !googleReviews.reviews ||
    googleReviews.reviews.length === 0 ||
    googleReviews.totalReviewCount === 0
  ) {
    return <NoReviewsPrompt />;
  }

  return (
    <Group className={classes.review_container}>
      <Box className={classes.review_summary}>
        <Group className={classes.average_reviews}>
          <ThemeIcon className={"checkmark"}>
            <IconBrandGoogle aria-label="Google" />
          </ThemeIcon>
          <Text>Overall Rating</Text>
        </Group>
        <Group>
          <Rating
            value={googleReviews.averageRating}
            emptySymbol={
              <IconStarFilled
                aria-label="Empty star"
                className={classes.empty_star}
              />
            }
            fullSymbol={
              <IconStarFilled
                aria-label="Filled yellow star"
                className={classes.filled_star}
              />
            }
            readOnly
          />
          <Text>
            {googleReviews.totalReviewCount} review
            {googleReviews.totalReviewCount === 1 ? "" : "s"}
          </Text>
        </Group>
        {ReviewButton()}
      </Box>
      <GoogleReviewCarousel googleReviews={googleReviews.reviews} />
    </Group>
  );
}
