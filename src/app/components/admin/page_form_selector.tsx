"use client";

import {
  PageContent,
  getStoredPageContent,
} from "@/actions/mongodb/pages/management";
import snakeCaseToTitleCase from "@/utils/snake_case_to_title_case";
import { Box, Group, Select, Tooltip, Button, Loader } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState, Suspense } from "react";
import { Pages } from "../layout/pages";
import LogoutButton from "./logout_button";
import PageFormLoader from "./page_form_loader";
import classes from "./page_form_selector.module.css";

interface SelectData {
  value: Pages;
  label: string;
}

export default function PageFormSelector({
  initialPage,
  initialContentPromise,
}: {
  initialPage: Pages;
  initialContentPromise: Promise<PageContent | null>;
}) {
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [contentPromise, setContentPromise] = useState(initialContentPromise);

  const pages: SelectData[] = Object.values(Pages).map((page) => ({
    value: page,
    label: snakeCaseToTitleCase(page),
  }));

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
            defaultValue={initialPage}
            data={pages}
            value={selectedPage ? selectedPage : initialPage}
            onChange={(_value, option) => {
              setSelectedPage(option.value as Pages);
              setContentPromise(getStoredPageContent(selectedPage));
            }}
            allowDeselect={false}
            classNames={classes}
          />
          <Tooltip label="Reset the form and fetch the latest content">
            <Button
              color="red"
              variant="light"
              onClick={() => {
                setContentPromise(getStoredPageContent(selectedPage));
              }}
            >
              <Group>
                Refresh <IconRefresh aria-label="Refresh" />
              </Group>
            </Button>
          </Tooltip>
        </Group>
      </Group>

      <Suspense
        fallback={
          <Box className={classes.loader_container}>
            <Loader type="bars" />
          </Box>
        }
      >
        <PageFormLoader
          selectedPage={selectedPage}
          contentPromise={contentPromise}
        />
      </Suspense>
    </Box>
  );
}
