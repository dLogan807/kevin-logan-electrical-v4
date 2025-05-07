"use client";

import { Box, Button, Group, Select, Tooltip } from "@mantine/core";
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

  //Store promise
  if (!initialPromise) initialPromise = null;
  const [contentPromise, setContentPromise] =
    useState<Promise<PageContent | null> | null>(initialPromise);

  //Get page content from database when selection changes
  useEffect(() => {
    setContentPromise(getStoredPageContent(selectedPage));
    setTriggerReset(!triggerReset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const pageContent = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <EditablePageContent triggerReset={triggerReset} />
    </PageContentProvider>
  ) : (
    <p>Please select a page to edit.</p>
  );

  return (
    <Box>
      <Group justify="space-between" mt="md">
        <Select
          label="Selected page"
          defaultValue={defaultPage}
          data={pages}
          value={selectedPage ? selectedPage : defaultPage}
          onChange={(_value, option) => setSelectedPage(option.value as Pages)}
          allowDeselect={false}
          classNames={classes}
        />
        <Group justify="space-between" mt="md">
          <ConfirmationPopover
            dialogue="Do you want to reset the form to initial values?"
            buttonText="Reset"
            buttonColour="red"
            buttonVariant="outline"
            clickAction={() => {
              setTriggerReset(!triggerReset);
            }}
          />
          <Tooltip label="Update initial values with latest content">
            <Button
              variant="light"
              color="blue"
              onClick={() => {
                setContentPromise(getStoredPageContent(selectedPage));
              }}
            >
              <Group>
                Refresh
                <IconRefresh aria-label="Refresh" />
              </Group>
            </Button>
          </Tooltip>
        </Group>
      </Group>

      {pageContent}
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
