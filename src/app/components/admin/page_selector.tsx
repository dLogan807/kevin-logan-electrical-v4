"use client";

import { Box, Button, Group, Select, Text, Tooltip } from "@mantine/core";
import { Pages } from "../layout/pages";
import React, { use, useState } from "react";
import {
  getStoredPageContent,
  PageContent,
} from "@/actions/mongodb/pages/management";
import { PageContentProvider, usePageContext } from "./page_context";
import { PageForm } from "./page_form";
import { IconLogout, IconRefresh } from "@tabler/icons-react";
import classes from "./page_selector.module.css";
import { logout } from "@/actions/mongodb/sessions/management";
import snakeCaseToTitleCase from "@/utils/snake_case_to_title_case";

interface SelectData {
  value: string;
  label: string;
}

export default function PageSelector({
  initialPromise,
}: {
  initialPromise: Promise<PageContent | null> | null;
}) {
  const pages: SelectData[] = Object.values(Pages).map((page) => ({
    value: page,
    label: snakeCaseToTitleCase(page),
  }));
  const defaultPage = Pages.Home;

  const [selectedPage, setSelectedPage] = useState<Pages>(defaultPage);

  //Store promise for content
  if (!initialPromise) initialPromise = null;
  const [contentPromise, setContentPromise] =
    useState<Promise<PageContent | null> | null>(initialPromise);
  const [contentVersion, setContentVersion] = useState(0);

  function loadPageContent(page: Pages) {
    setContentPromise(getStoredPageContent(page));
    setContentVersion((version) => version + 1);
  }

  const pageContentForm: React.ReactElement = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <EditablePageContent
        selectedPage={selectedPage}
        contentVersion={contentVersion}
      />
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
      <Group className={classes.content_control_group}>
        <Group className={classes.inner_content_control_group}>
          <Select
            label="Selected page"
            defaultValue={defaultPage}
            data={pages}
            value={selectedPage ? selectedPage : defaultPage}
            onChange={(_value, option) => {
              const page = option.value as Pages;
              setSelectedPage(page);
              loadPageContent(page);
            }}
            allowDeselect={false}
            classNames={classes}
          />
          <Tooltip label="Reset the form and fetch the latest content">
            <Button
              color="red"
              variant="light"
              onClick={() => loadPageContent(selectedPage)}
            >
              <Group>
                Refresh <IconRefresh aria-label="Refresh" />
              </Group>
            </Button>
          </Tooltip>
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

function EditablePageContent({
  selectedPage,
  contentVersion,
}: {
  selectedPage: Pages;
  contentVersion: number;
}): React.ReactNode {
  const pageContentPromise = usePageContext();
  const contentSections: PageContent | null = use(pageContentPromise);

  if (!contentSections)
    return <p>No content could be fetched for this page. Please try again.</p>;

  return (
    <PageForm
      key={`${selectedPage}-${contentVersion}`}
      selectedPage={selectedPage}
      initialContent={contentSections}
    />
  );
}
