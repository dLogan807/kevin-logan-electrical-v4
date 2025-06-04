"use client";

import { Carousel } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { GoogleReview } from "@/actions/google_reviews/get_reviews";
import ReviewCard from "./review_card";
import classes from "./carousel.module.css";

export default function GoogleReviewCarousel({
  googleReviews,
}: {
  googleReviews: GoogleReview[];
}) {
  const areMultipleReviews: boolean = googleReviews.length > 1;

  return (
    <Carousel
      emblaOptions={{
        loop: true,
        watchDrag: areMultipleReviews,
      }}
      nextControlIcon={<IconChevronRight aria-label="Right arrow" />}
      previousControlIcon={<IconChevronLeft aria-label="Left arrow" />}
      classNames={classes}
      className={classes.carousel}
      withControls={areMultipleReviews}
    >
      {googleReviews.map((review: GoogleReview) => (
        <Carousel.Slide className={classes.carousel_slide} key={review.id}>
          <ReviewCard {...review} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
