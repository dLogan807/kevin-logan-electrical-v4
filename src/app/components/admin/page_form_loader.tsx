import { PageContent } from "@/actions/mongodb/pages/management";
import { Pages } from "../layout/pages";
import { use } from "react";
import { Text } from "@mantine/core";
import PageForm from "./page_form";

export default function PageFormLoader({
  selectedPage,

  contentPromise,
}: {
  selectedPage: Pages;

  contentPromise: Promise<PageContent | null>;
}) {
  const content = use(contentPromise);

  if (!content)
    return (
      <Text>No content could be fetched for this page. Please try again.</Text>
    );

  return <PageForm selectedPage={selectedPage} content={content} />;
}
