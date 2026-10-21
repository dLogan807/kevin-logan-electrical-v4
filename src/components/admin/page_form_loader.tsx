import { PageContent } from "@/app/actions/mongodb/pages/management";
import { Pages } from "@/enums/pages";
import { use } from "react";
import { Text } from "@mantine/core";
import PageForm from "./page_form";

type PageFormLoaderProps = {
  selectedPage: Pages;
  contentPromise: Promise<PageContent | null>;
};

export default function PageFormLoader({
  selectedPage,
  contentPromise,
}: PageFormLoaderProps) {
  const content = use(contentPromise);

  if (!content)
    return (
      <Text>No content could be fetched for this page. Please try again.</Text>
    );

  return <PageForm selectedPage={selectedPage} content={content} />;
}
