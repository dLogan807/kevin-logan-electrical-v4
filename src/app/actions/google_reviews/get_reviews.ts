"use server";

//IMPORTANT: Ensure rate limiting is in place in the Google Places Console

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

//Cap the comment's length
function getTrimmedComment(comment: string, maxLength: number = 180): string {
  comment.trim();

  if (comment.length > maxLength) {
    return comment.substring(0, maxLength) + "...";
  }

  return comment;
}

//Return the date in the format DD/MM/YYYY
function getFormattedDate(utcDateString: string): string {
  var formattedDate = "Unknown date";

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

//Parse reviews to Type and clean data
function parseReviews(reviews: any[]): GoogleReview[] {
  const parsedReviews: GoogleReview[] = [];

  let id: number = 0;
  for (const review of reviews) {
    id++;
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

//Remove reviews on a per-name basis
function filterReviews(
  reviews: GoogleReview[],
  nameFilter: string[]
): GoogleReview[] {
  if (nameFilter.length === 0 || reviews.length === 0) {
    return reviews;
  }

  nameFilter = nameFilter.map((name) => name.toLowerCase());

  for (let i = reviews.length - 1; i >= 0; i--) {
    if (
      nameFilter.includes(
        reviews[i].authorAttribution.displayName.toLowerCase()
      )
    ) {
      reviews.splice(i, 1);
    }
  }

  return reviews;
}

//Get reviews from Google Places API
export default async function getGoogleReviews(
  searchQuery: string
): Promise<GoogleReviews | null> {
  if (searchQuery === "") {
    return null;
  }

  const headers: Headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("Referer", "https://kevinloganelectrical.co.nz/");
  headers.set("Content-Type", "application/json");
  headers.set("X-Goog-Api-Key", "" + process.env.GOOGLE_MAPS_API_KEY);
  headers.set(
    "X-Goog-FieldMask",
    "places.rating,places.userRatingCount,places.reviews"
  );

  const reviews: GoogleReviews | null = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        textQuery: searchQuery,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return {
        reviews: parseReviews(data.places[0].reviews),
        averageRating: data.places[0].rating,
        totalReviewCount: data.places[0].userRatingCount,
      };
    })
    .then((parsedReviews) => {
      //Remove select reviews

      const nameFilter: string[] =
        !process.env.REVIEW_NAME_FILTER ||
        process.env.REVIEW_NAME_FILTER.length === 0
          ? []
          : process.env.REVIEW_NAME_FILTER.split(",").map((name) =>
              name.trim()
            );

      if (nameFilter.length > 0) {
        parsedReviews.reviews = filterReviews(
          parsedReviews.reviews,
          nameFilter
        );
      }

      return parsedReviews;
    })
    .catch(() => {
      console.log("Error: Unable to fetch reviews");
      return null;
    });

  return reviews;
}
