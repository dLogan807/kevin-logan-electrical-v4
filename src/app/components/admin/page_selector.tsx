"use client";

import { Alert, Box, Button, Group, Select, Text } from "@mantine/core";
import { Pages } from "../layout/pages";
import React, { use, useEffect, useState } from "react";
import {
  getStoredPageContent,
  PageContent,
} from "@/actions/mongodb/pages/management";
import { PageContentProvider, usePageContext } from "./page_context";
import { PageForm } from "./page_form";
import { IconInfoCircle, IconLogout, IconRefresh } from "@tabler/icons-react";
import ConfirmationPopover from "./confirmation_popover";

import classes from "./page_selector.module.css";
import { logout } from "@/actions/mongodb/sessions/management";

export default function PageSelector({
  initialPromise,
}: {
  initialPromise: Promise<PageContent | null> | null;
}) {
  const pages = Object.values(Pages);
  const defaultPage = pages[0];

  const [selectedPage, setSelectedPage] = useState<Pages>(defaultPage);

  //Store promise for content
  if (!initialPromise) initialPromise = null;
  const [contentPromise, setContentPromise] =
    useState<Promise<PageContent | null> | null>(initialPromise);

  //Get page content from database when selection changes
  useEffect(() => {
    setContentPromise(getStoredPageContent(selectedPage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  const pageContentForm: React.ReactElement = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <EditablePageContent selectedPage={selectedPage} />
    </PageContentProvider>
  ) : (
    <Text>Please select a page to edit.</Text>
  );

  return (
    <Box>
      <Box className={classes.header_group}>
        <LogoutButton />
        <h1>Content Mangement</h1>
      </Box>
      <ContentAlert />
      <Group className={classes.content_control_group}>
        <Group className={classes.inner_content_control_group}>
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
      </Group>

      {pageContentForm}
    </Box>
  );
}

function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  return (
    <Button
      variant="default"
      loading={isLoggingOut}
      onClick={() => {
        setIsLoggingOut(true);
        logout();
      }}
    >
      <Group>
        <Text>Logout</Text>
        <IconLogout aria-label="Logout" />
      </Group>
    </Button>
  );
}

function ContentAlert() {
  const [alertClosed, setAlertClosed] = useState<boolean>(false);
  const infoIcon = <IconInfoCircle />;

  return (
    <Alert
      variant="light"
      title="Submission"
      icon={infoIcon}
      withCloseButton={true}
      onClose={() => {
        setAlertClosed(true);
      }}
      hidden={alertClosed}
    >
      After submission, it may take up to 5 days to become live on the website.
      However, the latest content will always be retrieved here.
    </Alert>
  );
}

function EditablePageContent({
  selectedPage,
}: {
  selectedPage: Pages;
}): React.ReactNode {
  const pageContentPromise = usePageContext();
  const contentSections: PageContent | null = use(pageContentPromise);

  if (!contentSections)
    return <p>No content could be fetched for this page. Please try again.</p>;

  return (
    <PageForm selectedPage={selectedPage} initialContent={contentSections} />
  );
}
