"use client";

import { Carousel } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ReviewCard from "../cards/ReviewCard/ReviewCard";
import classes from "./google_review_carousel.module.css";
import { GoogleReview } from "@/types/googleReview";

type GoogleReviewCarouselProps = {
  reviews: GoogleReview[];
};

export default function GoogleReviewCarousel({
  reviews,
}: GoogleReviewCarouselProps) {
  const multipleReviews = reviews.length > 1;

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
      {reviews.map((review: GoogleReview) => (
        <Carousel.Slide className={classes.carousel_slide} key={review.id}>
          <ReviewCard review={{ ...review }} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
