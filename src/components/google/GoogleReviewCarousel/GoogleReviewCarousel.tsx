"use client";

import { Carousel } from "@mantine/carousel";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { GoogleReview } from "@/types/googleReview";
import ReviewCard from "@/components/cards/ReviewCard/ReviewCard";
import classes from "./GoogleReviewCarousel.module.css";

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
      nextControlIcon={<IconChevronRight aria-hidden />}
      previousControlIcon={<IconChevronLeft aria-hidden />}
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
