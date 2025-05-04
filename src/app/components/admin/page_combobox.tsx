"use client";

import {
  Box,
  Button,
  Fieldset,
  Group,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Pages } from "../layout/pages";
import React, { use, useEffect, useState } from "react";

import classes from "./page_combobox.module.css";
import {
  getStoredPageContent,
  PageContent,
} from "@/actions/mongodb/db_handler";
import { PageContentProvider, usePageContext } from "./page_context";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";

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

  const form = useForm({
    mode: "uncontrolled",
  });

  const component = contentPromise ? (
    <PageContentProvider pageContentPromise={contentPromise}>
      <form onSubmit={form.onSubmit((values: any) => console.log(values))}>
        <PageContentDisplay />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
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

  const objectContent = Object.entries(contentSections);

  return getObjectEntries(objectContent);
}

function getObjectEntries(contentObject: [string, any][]): React.ReactNode {
  return contentObject.map(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      //console.log("Found nested object: " + key);

      return (
        <Fieldset legend={key.toString()} key={key}>
          {getObjectEntries(Object.entries(value))}
        </Fieldset>
      );
    } else {
      //console.log(key + ": " + value);
      return value.toString().length < 50 ? (
        <TextInput
          key={key.toString() + randomId()}
          label={key.toString()}
          placeholder={"Text to display for " + key}
          defaultValue={value.toString()}
        />
      ) : (
        <Textarea
          key={key.toString() + randomId()}
          label={key.toString()}
          placeholder={"Text to display for " + key}
          defaultValue={value.toString()}
          autosize={true}
        />
      );
    }
  });
}
