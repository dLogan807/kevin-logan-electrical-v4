"use client";

import { getStoredPageContent } from "@/actions/mongodb/pages/management";
import { PageContent } from "@/types/pageContent";
import snakeCaseToTitleCase from "@/utils/snakeCaseToTitleCase";
import {
  Box,
  Group,
  Select,
  Button,
  Loader,
  Title,
  ComboboxItem,
} from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState, Suspense, useEffect } from "react";
import { Pages } from "@/enums/pages";
import LogoutButton from "@/components/buttons/LogoutButton/LogoutButton";
import PageFormLoader from "./page_form_loader";
import classes from "./page_form_selector.module.css";

interface SelectData {
  value: Pages;
  label: string;
}

const pages: SelectData[] = Object.values(Pages).map((page) => ({
  value: page,
  label: snakeCaseToTitleCase(page),
}));

type PageFormSelectorProps = {
  initialPage: Pages;
  initialContentPromise: Promise<PageContent | null>;
};

export default function PageFormSelector({
  initialPage,
  initialContentPromise,
}: PageFormSelectorProps) {
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [contentPromise, setContentPromise] = useState(initialContentPromise);
  const [selectedPageChangeCount, setSelectedPageChangeCount] = useState(0);

  function handlePageSelectionChange(option: ComboboxItem<Pages> | null) {
    if (!option) return;

    const newPage = option.value as Pages;
    setSelectedPage(newPage);
    setContentPromise(getStoredPageContent(newPage));
  }

  function handleRefresh() {
    setSelectedPageChangeCount((prev) => prev + 1);
    setContentPromise(getStoredPageContent(selectedPage));
  }

  return (
    <Box>
      <Box className={classes.header_group}>
        <LogoutButton />
        <Title order={1}>Content Management</Title>
      </Box>
      <Group className={classes.content_control_group}>
        <Group className={classes.inner_content_control_group}>
          <Select
            label="Selected page"
            defaultValue={selectedPage}
            data={pages}
            value={selectedPage}
            onChange={(_value, option) => handlePageSelectionChange(option)}
            allowDeselect={false}
            classNames={{
              root: classes.page_form_selector_root,
              option: classes.page_form_selector_option,
            }}
          />

          <Button
            color="red"
            variant="light"
            onClick={handleRefresh}
            rightSection={<IconRefresh aria-label="Refresh" />}
          >
            Refresh
          </Button>
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
          key={`${selectedPage}${selectedPageChangeCount}`}
          selectedPage={selectedPage}
          contentPromise={contentPromise}
        />
      </Suspense>
    </Box>
  );
}
