import { IconBrandGoogle, IconStarFilled } from "@tabler/icons-react";
import { Box, Group, Rating, Text, ThemeIcon } from "@mantine/core";
import { getGoogleReviews } from "@/actions/google/getGoogleReviews";
import GoogleReviewCarousel from "@/components/google/GoogleReviewCarousel/GoogleReviewCarousel";
import ReviewButton from "@/components/buttons/ReviewButton/ReviewButton";
import classes from "./GoogleReviewContainer.module.css";

type GoogleReviewContainerProps = {
  query: string;
  nameFilter: string[];
};

export default async function GoogleReviewContainer({
  query,
  nameFilter,
}: GoogleReviewContainerProps) {
  const googleReviews = await getGoogleReviews(query, nameFilter);

  if (!googleReviews?.reviews || googleReviews.totalReviewCount === 0) {
    return (
      <Group className={classes.no_reviews_prompt}>
        <Text>Had work done? Consider leaving a review!</Text>
        <ReviewButton />
      </Group>
    );
  }

  return (
    <Group className={classes.review_container}>
      <Box className={classes.review_summary}>
        <Group className={classes.average_reviews}>
          <ThemeIcon>
            <IconBrandGoogle aria-hidden />
          </ThemeIcon>
          <Text>Overall Rating</Text>
        </Group>
        <Group>
          <Rating
            value={googleReviews.averageRating}
            aria-label={`Average review rating: ${googleReviews.averageRating}/5 stars`}
            emptySymbol={
              <IconStarFilled aria-hidden className={classes.empty_star} />
            }
            fullSymbol={
              <IconStarFilled aria-hidden className={classes.filled_star} />
            }
            readOnly
          />
          <Text>
            {`${googleReviews.totalReviewCount} review${googleReviews.totalReviewCount === 1 ? "" : "s"}`}
          </Text>
        </Group>
        <ReviewButton />
      </Box>
      <GoogleReviewCarousel reviews={googleReviews.reviews} />
    </Group>
  );
}
