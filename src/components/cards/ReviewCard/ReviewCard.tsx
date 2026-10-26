import { Blockquote, Group, Rating, Text } from "@mantine/core";
import { IconStarFilled, IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { theme } from "@/theme";
import classes from "./ReviewCard.module.css";
import { GoogleReview } from "@/types/googleReview";

type UserImageProps = { uri: string };

function UserImage({ uri }: UserImageProps) {
  if (!uri) {
    return (
      <IconUserCircle
        aria-label="User profile picture"
        width={30}
        height={30}
      />
    );
  }

  return (
    <Image
      width={30}
      height={30}
      src={uri}
      alt="User profile picture"
      sizes={`(max-width: ${theme.breakpoints.xl}) 4vw`}
      priority
    />
  );
}

type ReviewCardProps = { review: GoogleReview };

export default function ReviewCard({ review }: ReviewCardProps) {
  if (!review) return <Text>Failed to load this review.</Text>;

  return (
    <Blockquote
      color="blue"
      cite={
        <Group className={classes.review_card_cite}>
          <Text>
            {"- "}

            <Link
              className={classes.author_name}
              href={review.authorAttribution.uri}
            >
              {review.authorAttribution.displayName}
            </Link>
          </Text>
          <Text>{review.publishTime}</Text>
        </Group>
      }
      className={classes.review_card_blockquote}
    >
      <Group>
        <UserImage uri={review.authorAttribution.photoUri} />
        <Rating
          value={review.rating}
          emptySymbol={
            <IconStarFilled className={classes.empty_star} aria-hidden />
          }
          fullSymbol={
            <IconStarFilled className={classes.filled_star} aria-hidden />
          }
          className={classes.star_rating}
          aria-label={`Reviewed as ${review.rating}/5 stars`}
          readOnly
        />
      </Group>
      {review.text}
    </Blockquote>
  );
}
