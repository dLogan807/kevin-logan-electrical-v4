"use client";

import { Box, Select } from "@mantine/core";
import { Pages } from "../layout/pages";
import React, { use, useEffect, useState } from "react";
import {
  getStoredPageContent,
  PageContent,
} from "@/actions/mongodb/db_handler";
import { PageContentProvider, usePageContext } from "./page_context";
import { PageForm } from "./page_form";

import classes from "./page_combobox.module.css";

export default function PageComboBox({
  initialPromise,
}: {
  initialPromise: Promise<PageContent | null> | null;
}) {
  const pages = Object.values(Pages);
  const defaultPage = pages[0];

  const [selectedPage, setSelectedPage] = useState<Pages>(defaultPage);

  //Store promise
  if (!initialPromise) initialPromise = null;
  const [contentPromise, setContentPromise] =
    useState<Promise<PageContent | null> | null>(initialPromise);

  //Get page content from database when selection changes
  useEffect(() => {
    setContentPromise(getStoredPageContent(selectedPage));
  }, [selectedPage]);

  const component = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <PageContentDisplay />
    </PageContentProvider>
  ) : (
    <p>Please select a page to edit.</p>
  );

  return (
    <Box>
      <Select
        label="Selected page"
        defaultValue={defaultPage}
        data={pages}
        value={selectedPage ? selectedPage : defaultPage}
        onChange={(_value, option) => setSelectedPage(option.value as Pages)}
        allowDeselect={false}
        classNames={classes}
      />
      {component}
    </Box>
  );
}

export function PageContentDisplay(): React.ReactNode {
  const pageContentPromise = usePageContext();
  const contentSections: PageContent | null = use(pageContentPromise);

  if (!contentSections)
    return <p>No content could be fetched for this page. Please try again.</p>;

  return <PageForm initialContent={contentSections} />;
}
