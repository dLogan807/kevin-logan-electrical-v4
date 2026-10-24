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
