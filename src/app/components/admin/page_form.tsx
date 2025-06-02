import React, { useEffect, useState } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconWorldUp } from "@tabler/icons-react";
import {
  addPageDocument,
  PageContent,
} from "@/actions/mongodb/pages/management";
import { Pages } from "../layout/pages";

import classes from "./page_form.module.css";
import { FormAlert, FormMessage } from "@/components/form/form_alert";

export function PageForm({
  selectedPage,
  initialContent,
}: {
  selectedPage: Pages;
  initialContent: PageContent;
}) {
  const form = useForm<PageContent>({
    mode: "uncontrolled",
  });
  const [formMessage, setFormMessage] = useState<FormMessage>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  //Rerender form with new fetched content
  useEffect(() => {
    form.setInitialValues(initialContent);
    form.reset();
    setFormMessage({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  const objectContent = Object.entries(form.getValues());

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submitSuccess: boolean = await addPageDocument(
      selectedPage,
      form.getValues()
    );
    const submitMessage: FormMessage = submitSuccess
      ? { message: "Success! " + selectedPage + " has been updated" }
      : { message: "Failed to update " + selectedPage, isError: true };
    setFormMessage(submitMessage);

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <Stack>
        {FormFields(objectContent, "", form)}
        <FormAlert formMessage={formMessage} />
        <Group className={classes.submit_button_group}>
          <Tooltip label="Submit and update website content">
            <Button type="submit" loading={isSubmitting}>
              <Group>
                Submit
                <IconWorldUp aria-label="Internet submission" />
              </Group>
            </Button>
          </Tooltip>
        </Group>
      </Stack>
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
    <Group className={classes.add_entry_button}>
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
        <Fieldset legend={<b>{key}</b>} key={formKey}>
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
              <IconTrash className={classes.delete_icon} aria-label="Trash" />
            </ActionIcon>
          </Tooltip>
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
