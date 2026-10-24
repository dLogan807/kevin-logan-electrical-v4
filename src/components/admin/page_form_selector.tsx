"use client";

import {
  PageContent,
  getStoredPageContent,
} from "@/actions/mongodb/pages/management";
import snakeCaseToTitleCase from "@/utils/snake_case_to_title_case";
import { Box, Group, Select, Button, Loader, Title } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState, Suspense } from "react";
import { Pages } from "@/enums/pages";
import LogoutButton from "./logout_button";
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
            onChange={(_value, option) => {
              if (!option) return;

              const newPage = option.value as Pages;
              setSelectedPage(newPage);
              setContentPromise(getStoredPageContent(newPage));
            }}
            allowDeselect={false}
            classNames={{
              root: classes.page_form_selector_root,
              option: classes.page_form_selector_option,
            }}
          />

          <Button
            color="red"
            variant="light"
            onClick={() =>
              setContentPromise(getStoredPageContent(selectedPage))
            }
          >
            <Group>
              Refresh <IconRefresh aria-label="Refresh" />
            </Group>
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
          key={selectedPage}
          selectedPage={selectedPage}
          contentPromise={contentPromise}
        />
      </Suspense>
    </Box>
  );
}
