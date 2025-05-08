"use client";

import { Box, Group, Select, Text } from "@mantine/core";
import { Pages } from "../layout/pages";
import React, { use, useEffect, useState } from "react";
import {
  getStoredPageContent,
  PageContent,
} from "@/actions/mongodb/db_handler";
import { PageContentProvider, usePageContext } from "./page_context";
import { PageForm } from "./page_form";

import classes from "./page_selector.module.css";
import { IconRefresh } from "@tabler/icons-react";
import ConfirmationPopover from "./confirmation_popover";

export default function PageSelector({
  initialPromise,
}: {
  initialPromise: Promise<PageContent | null> | null;
}) {
  const pages = Object.values(Pages);
  const defaultPage = pages[0];

  const [selectedPage, setSelectedPage] = useState<Pages>(defaultPage);
  const [triggerReset, setTriggerReset] = useState<boolean>();

  //Store promise for content
  if (!initialPromise) initialPromise = null;
  const [contentPromise, setContentPromise] =
    useState<Promise<PageContent | null> | null>(initialPromise);

  //Get page content from database when selection changes
  useEffect(() => {
    setContentPromise(getStoredPageContent(selectedPage));
    setTriggerReset(!triggerReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const pageContentForm = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <EditablePageContent triggerReset={triggerReset} />
    </PageContentProvider>
  ) : (
    <Text>Please select a page to edit.</Text>
  );

  return (
    <Box>
      <Group justify="space-between" mt="md">
        <Group justify="space-between" mt="md">
          <Select
            label="Selected page"
            defaultValue={defaultPage}
            data={pages}
            value={selectedPage ? selectedPage : defaultPage}
            onChange={(_value, option) =>
              setSelectedPage(option.value as Pages)
            }
            allowDeselect={false}
            classNames={classes}
          />

          <ConfirmationPopover
            dialogue="Reset the form and fetch the latest content?"
            buttonText="Refresh"
            buttonTooltip="Update initial values with the latest content"
            buttonColour="red"
            buttonVariant="light"
            clickAction={() => {
              setContentPromise(getStoredPageContent(selectedPage));
            }}
          >
            <IconRefresh aria-label="Refresh" />
          </ConfirmationPopover>
        </Group>

        <ConfirmationPopover
          dialogue="Reset the form to the last-fetched content?"
          buttonText="Reset"
          buttonColour="red"
          buttonVariant="outline"
          clickAction={() => {
            setTriggerReset(!triggerReset);
          }}
        />
      </Group>

      {pageContentForm}
    </Box>
  );
}

export function EditablePageContent({
  triggerReset,
}: {
  triggerReset?: boolean;
}): React.ReactNode {
  const pageContentPromise = usePageContext();
  const contentSections: PageContent | null = use(pageContentPromise);

  if (!contentSections)
    return <p>No content could be fetched for this page. Please try again.</p>;

  return (
    <PageForm initialContent={contentSections} triggerReset={triggerReset} />
  );
}
