import { Pages } from "@/enums/pages";
import { use } from "react";
import { Text } from "@mantine/core";
import PageForm from "@/components/forms/PageForm/PageForm";
import { PageContent } from "@/types/pageContent";

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
