import { Blockquote, Group, Rating, Text } from "@mantine/core";
import { IconMessage2, IconStarFilled } from "@tabler/icons-react";
import classes from "./review_card.module.css";

export type GoogleReview = {
  reviewId: string;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    isAnonymous: boolean;
  };
  starRating: number;
  comment: string;
  updateTime: string; //RFC3339 UTC
};

export default function ReviewCard(review: GoogleReview) {
  return (
    <Blockquote
      color="blue"
      cite={
        <Group className={classes.review_card_cite}>
          <Text>{"- " + review.reviewer.displayName}</Text>
          <Text>{getFormattedDate(review.updateTime)}</Text>
        </Group>
      }
      icon={<IconMessage2 aria-label="Comment icon" />}
      className={classes.review_card_blockquote}
    >
      <Rating
        value={review.starRating}
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
      {getTrimmedComment(review.comment)}
    </Blockquote>
  );
}

//Cap the comment's length
function getTrimmedComment(comment: string, maxLength: number = 150): string {
  comment.trim();

  if (comment.length > maxLength) {
    return comment.substring(0, maxLength) + "...";
  }

  return comment;
}

//Return the date in the format DD/MM/YYYY
function getFormattedDate(utcDateString: string): string {
  var formattedDate = "";

  if (!utcDateString || utcDateString === "") {
    return formattedDate;
  }

  try {
    formattedDate = new Intl.DateTimeFormat("en-NZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(utcDateString));
  } catch {
    formattedDate = "Unknown date";
    console.log("Warning: Unable to convert review date to local time.");
  }

  return formattedDate;
}
