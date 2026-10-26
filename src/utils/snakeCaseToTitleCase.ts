export default function snakeCaseToTitleCase(text: string): string {
  return text
    .split("_")
    .map((word) => {
      const normalized = word.toLowerCase();
      if (normalized === "and") {
        return "&";
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
