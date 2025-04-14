import { Blockquote, Group, Rating, Text } from "@mantine/core";
import { IconMessage2, IconStarFilled } from "@tabler/icons-react";
import { GoogleReview } from "@/actions/google_reviews/get_reviews";
import classes from "./review_card.module.css";

export default function ReviewCard(review: GoogleReview) {
  return (
    <Blockquote
      color="blue"
      cite={
        <Group className={classes.review_card_cite}>
          <Text>{"- " + review.authorAttribution.displayName}</Text>
          <Text>{review.publishTime}</Text>
        </Group>
      }
      icon={<IconMessage2 aria-label="Comment icon" />}
      className={classes.review_card_blockquote}
    >
      <Rating
        value={review.rating}
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
        className={classes.star_rating}
        readOnly
      />
      {review.text}
    </Blockquote>
  );
}
