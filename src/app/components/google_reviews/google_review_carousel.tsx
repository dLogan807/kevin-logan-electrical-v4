"use client";

import { Carousel } from "@mantine/carousel";
import {
  IconArrowRight,
  IconBrandGoogle,
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
} from "@tabler/icons-react";
import ReviewCard, { GoogleReview } from "./review_card";
import { Box, Button, Group, Rating, Text, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import classes from "./google_review_carousel.module.css";
import carouselStyling from "./carousel.module.css";

type GoogleReviews = {
  reviews: GoogleReview[];
  averageRating: number;
  totalReviewCount: number;
  nextPageToken: string;
};

export default function GoogleReviewCarousel() {
  const googleReviews: GoogleReviews = {
    reviews: [
      {
        reviewId: "1",
        reviewer: {
          profilePhotoUrl: "",
          displayName: "Jimmy Kenaly",
          isAnonymous: false,
        },
        starRating: 5,
        comment:
          "Enim et dolorem sint nesciunt sequi quo dolorum esse. Nam provident quos sequi ut officiis sed harum. Quasi laboriosam eum voluptas explicabo omnis molestias repudiandae. Ullam ducimus iusto quo molestiae. Corporis neque quod eius. Aut voluptatum consequatur cumque cupiditate dolores fugit ex blanditiis.",
        updateTime: "2020-10-02T15:01:23Z",
      },
      {
        reviewId: "2",
        reviewer: {
          profilePhotoUrl: "",
          displayName: "Motrick Ferque",
          isAnonymous: false,
        },
        starRating: 4,
        comment:
          "I had the delight of having an excellent job done by this company. Would recommend wholeheartedly.",
        updateTime: "2014-10-02T15:01:23Z",
      },
    ],
    averageRating: 5,
    totalReviewCount: 2,
    nextPageToken: "",
  };

  const reviewButton = (
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

  if (
    !googleReviews ||
    !googleReviews.reviews ||
    googleReviews.reviews.length === 0 ||
    googleReviews.totalReviewCount === 0
  ) {
    return (
      <Group className={classes.no_reviews_prompt}>
        <Text>Had work done? Consider leaving a review on Google!</Text>
        {reviewButton}
      </Group>
    );
  }

  return (
    <Group className={classes.review_container}>
      <Box className={classes.review_summary}>
        <Group className={classes.average_reviews}>
          <ThemeIcon className={"checkmark"}>
            <IconBrandGoogle aria-label="Google icon" />
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
          <Text>{googleReviews.totalReviewCount} reviews</Text>
        </Group>
        {reviewButton}
      </Box>
      <Carousel
        loop={true}
        nextControlIcon={<IconChevronRight aria-label="Right arrow" />}
        previousControlIcon={<IconChevronLeft aria-label="Left arrow" />}
        classNames={carouselStyling}
        className={classes.carousel}
      >
        {googleReviews.reviews.map((review: GoogleReview) => (
          <Carousel.Slide
            className={classes.carousel_slide}
            key={review.reviewId}
          >
            <ReviewCard {...review} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </Group>
  );
}
