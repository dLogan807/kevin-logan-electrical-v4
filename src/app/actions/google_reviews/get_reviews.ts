"use server";

import { cache } from "react";
import { rateLimitReached } from "@/actions/rate_limit/global_rate_limit";

export type GoogleReviews = {
  reviews: GoogleReview[];
  averageRating: number;
  totalReviewCount: number;
};

export type GoogleReview = {
  id: number;
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string; //RFC3339 UTC
  rating: number;
  text: string;
};

type GooglePlacesApiReview = Omit<GoogleReview, "id" | "text"> & {
  text: { text: string };
};

//Cap the comment's length
function getTrimmedComment(comment: string, maxLength: number = 180): string {
  if (!comment) return "(No comment left by reviewer.)";

  comment.trim();

  if (comment.length > maxLength) {
    return comment.substring(0, maxLength) + "...";
  }

  return comment;
}

//Return the date in the format DD/MM/YYYY
function getFormattedDate(utcDateString: string): string {
  let formattedDate: string = "Unknown date";

  if (!utcDateString) return formattedDate;

  try {
    formattedDate = new Intl.DateTimeFormat("en-NZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(utcDateString));
  } catch {
    formattedDate = "Unknown date";
    console.warn("Unable to convert review date to local time.");
  }

  return formattedDate;
}

//Parse reviews to Type and clean data
function parseReviews(
  reviews: GooglePlacesApiReview[],
  nameFilter: string[] = [],
): GoogleReview[] {
  if (!reviews) return [];

  nameFilter = nameFilter.map((name) => name.trim().toLowerCase());

  const parsedReviews: GoogleReview[] = [];

  let id = 0;
  for (const review of reviews) {
    id++;
    if (
      nameFilter.includes(review.authorAttribution.displayName.toLowerCase())
    ) {
      continue;
    }

    parsedReviews.push({
      id: id,
      authorAttribution: {
        displayName: review.authorAttribution.displayName,
        uri: review.authorAttribution.uri,
        photoUri: review.authorAttribution.photoUri,
      },
      publishTime: getFormattedDate(review.publishTime),
      rating: review.rating,
      text: getTrimmedComment(review.text.text),
    });
  }

  return parsedReviews;
}

//Get reviews from Google Places API
export const getGoogleReviews = cache(
  async (
    searchQuery: string,
    nameFilter?: string[],
  ): Promise<GoogleReviews | null> => {
    if (process.env.NODE_ENV === "development") return null;
    if (!searchQuery) return null;
    if (await rateLimitReached("google_reviews")) return null;

    const headers: Headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Referer", "https://kevinloganelectrical.co.nz/");
    headers.set("Content-Type", "application/json");
    headers.set("X-Goog-Api-Key", `${process.env.GOOGLE_MAPS_API_KEY}`);
    headers.set(
      "X-Goog-FieldMask",
      "places.rating,places.userRatingCount,places.reviews",
    );

    const reviews: GoogleReviews | null = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          textQuery: searchQuery,
        }),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        return {
          reviews: parseReviews(data.places[0].reviews, nameFilter),
          averageRating: data.places[0].rating,
          totalReviewCount: data.places[0].userRatingCount,
        };
      })
      .catch(() => null);

    return reviews;
  },
);
