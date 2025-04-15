import { Blockquote, Group, Rating, Text } from "@mantine/core";
import {
  IconMessage2,
  IconStarFilled,
  IconUserCircle,
} from "@tabler/icons-react";
import { GoogleReview } from "@/actions/google_reviews/get_reviews";
import Link from "next/link";
import Image from "next/image";
import { theme } from "@/components/theme";
import classes from "./review_card.module.css";

function UserImage({ uri }: { uri: string }) {
  if (uri === "") {
    return <IconUserCircle aria-label="User icon" width={30} height={30} />;
  }

  return (
    <Image
      width={30}
      height={30}
      src={uri}
      alt="User image"
      sizes={`(max-width: ${theme.breakpoints.xl}) 4vw`}
      priority
    />
  );
}

export default function ReviewCard(review: GoogleReview) {
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
      icon={<IconMessage2 aria-label="Comment icon" />}
      className={classes.review_card_blockquote}
    >
      <Group>
        <UserImage uri={review.authorAttribution.photoUri} />
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
      </Group>
      {review.text}
    </Blockquote>
  );
}
