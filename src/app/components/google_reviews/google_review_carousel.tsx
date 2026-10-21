"use client";

import { Carousel } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { GoogleReview } from "@/app/actions/google_reviews/get_reviews";
import ReviewCard from "./google_review_card";
import classes from "./google_review_carousel.module.css";

type GoogleReviewCarouselProps = {
  googleReviews: GoogleReview[];
};

export default function GoogleReviewCarousel({
  googleReviews,
}: GoogleReviewCarouselProps) {
  const multipleReviews = googleReviews.length > 1;

  return (
    <Carousel
      emblaOptions={{
        loop: true,
        watchDrag: multipleReviews,
      }}
      nextControlIcon={<IconChevronRight aria-label="Right arrow" />}
      previousControlIcon={<IconChevronLeft aria-label="Left arrow" />}
      classNames={{
        root: classes.carousel,
        controls: classes.controls,
        viewport: classes.viewport,
      }}
      withControls={multipleReviews}
      slideGap="md"
    >
      {googleReviews.map((review: GoogleReview) => (
        <Carousel.Slide className={classes.carousel_slide} key={review.id}>
          <ReviewCard review={{ ...review }} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
