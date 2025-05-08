import { PageContent } from "@/actions/mongodb/db_handler";
import React, { useEffect } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconWorldUp } from "@tabler/icons-react";

import classes from "./page_form.module.css";

export function PageForm({
  initialContent,
  triggerReset,
}: {
  initialContent: PageContent;
  triggerReset?: boolean;
}) {
  const form = useForm<PageContent>({
    mode: "uncontrolled",
  });

  //Rerender form with new fetched content
  useEffect(() => {
    form.setInitialValues(initialContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  const objectContent = Object.entries(form.getValues());

  useEffect(() => {
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerReset]);

  return (
    <form
      onSubmit={form.onSubmit(() => {
        console.log(form.getValues());
      })}
    >
      {FormFields(objectContent, "", form)}
      <Group justify="flex-end" mt="md">
        <Tooltip label="Submit and update website content">
          <Button type="submit">
            <Group>
              Submit
              <IconWorldUp aria-label="Internet submission" />
            </Group>
          </Button>
        </Tooltip>
      </Group>
    </form>
  );
}

function isNumber(value: string): boolean {
  return value != null && !isNaN(Number(value)) && value.trim() !== "";
}

function isParent(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function AddEntryButton({
  form,
  currentPath,
}: {
  form: UseFormReturnType<PageContent>;
  currentPath: string;
}) {
  return (
    <Group justify="center" mt="md">
      <Button onClick={() => form.insertListItem(currentPath, "")}>
        Add entry
      </Button>
    </Group>
  );
}

//Recursively generate form fields from entries
function FormFields(
  contentObject: [string, any][],
  path: string,
  form: UseFormReturnType<PageContent>
): React.ReactNode {
  return contentObject.map(([key, value]) => {
    const currentPath: string = path === "" ? key : path + "." + key;
    const formKey: string = form.key(currentPath);

    //If the value has child entries (recursive case). Add button if parent is a list
    if (isParent(value)) {
      return (
        <Fieldset legend={key} key={formKey}>
          {FormFields(Object.entries(value), currentPath, form)}
          {Array.isArray(value) ? (
            <AddEntryButton form={form} currentPath={currentPath} />
          ) : null}
        </Fieldset>
      );
    }

    //If value is part of a list
    if (isNumber(key)) {
      const listNum: Number = Number(key) + 1;

      return (
        <Group key={key} className={classes.text_input_container}>
          <Tooltip label="Delete entry">
            <ActionIcon
              color="red"
              onClick={() => {
                form.removeListItem(path, Number(key));
              }}
            >
              <IconTrash size={16} aria-label="Trash" />
            </ActionIcon>
          </Tooltip>{" "}
          <TextInput
            key={formKey}
            {...form.getInputProps(currentPath)}
            label={"Entry " + listNum}
            className={classes.text_input}
          />
        </Group>
      );
    }

    return (
      <Textarea
        key={formKey}
        {...form.getInputProps(currentPath)}
        label={key}
        rows={1}
        autosize={true}
      />
    );
  });
}
