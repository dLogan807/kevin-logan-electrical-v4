"use client";

import { useState } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconWorldUp } from "@tabler/icons-react";
import {
  addPageDocument,
  PageContent,
} from "@/actions/mongodb/pages/management";
import { Pages } from "@/enums/pages";
import { SuccessOrFailureAlert } from "@/components/alerts/SuccessOrFailureAlert/SuccessOrFailureAlert";
import Link from "next/link";
import snakeCaseToTitleCase from "@/utils/snake_case_to_title_case";
import { SuccessOrFailureAlertState } from "@/types/successOrFailureAlertState";
import classes from "./PageForm.module.css";

type PageFormProps = {
  selectedPage: Pages;
  content: PageContent;
};

export default function PageForm({ selectedPage, content }: PageFormProps) {
  const form = useForm<PageContent>({
    mode: "uncontrolled",
    initialValues: content,
  });
  const [formAlertState, setFormAlertState] =
    useState<SuccessOrFailureAlertState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const objectContent = Object.entries(form.getValues());

  const formattedPageTitle = snakeCaseToTitleCase(selectedPage);

  async function handleSubmit(formValues: PageContent) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const submitSuccess = await addPageDocument(selectedPage, formValues);
    const submitMessage = submitSuccess
      ? {
          message: (
            <Text>
              {`'${formattedPageTitle}' has been updated. See your changes `}
              <Link href={`${getPageRoute(selectedPage)}`}>here</Link>
            </Text>
          ),
        }
      : { message: "Failed to update " + selectedPage, isError: true };
    setFormAlertState(submitMessage);

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <FormFields contentObject={objectContent} form={form} />
        <SuccessOrFailureAlert state={formAlertState} />
        <Group className={classes.submit_button_group}>
          <Tooltip label="Submit and update website content">
            <Button type="submit" loading={isSubmitting}>
              <Group>
                Update {formattedPageTitle}
                <IconWorldUp aria-label="Internet submission" />
              </Group>
            </Button>
          </Tooltip>
        </Group>
      </Stack>
    </form>
  );
}

function getPageRoute(page: Pages): string {
  if (page === Pages.Home) return "/";

  return page.replaceAll("_", "");
}

type FormFieldsProps = {
  contentObject: [string, unknown][];
  form: UseFormReturnType<PageContent>;
  path?: string;
};

//Recursively generate form fields from entries
function FormFields({ contentObject, path = "", form }: FormFieldsProps) {
  return contentObject.map(([key, value]) => {
    const currentPath: string = path === "" ? key : path + "." + key;
    const formKey: string = form.key(currentPath);

    //If the value has child entries (recursive case). Add button if parent is a list
    if (isParent(value)) {
      return (
        <Fieldset legend={<b>{snakeCaseToTitleCase(key)}</b>} key={formKey}>
          <Stack>
            <FormFields
              contentObject={Object.entries(value)}
              form={form}
              path={currentPath}
            />
            {Array.isArray(value) ? (
              <AddEntryButton form={form} currentPath={currentPath} />
            ) : null}
          </Stack>
        </Fieldset>
      );
    }

    //If value is part of a list
    if (isNumber(key)) {
      const listNum = Number(key) + 1;

      return (
        <Group key={key} className={classes.text_input_container}>
          <Tooltip label="Delete entry">
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem(path, Number(key))}
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
        label={snakeCaseToTitleCase(key)}
        rows={1}
        autosize={true}
      />
    );
  });
}

function isNumber(value: string): boolean {
  return value != null && !isNaN(Number(value)) && value.trim() !== "";
}

function isParent(value: unknown) {
  return typeof value === "object" && value !== null;
}

type AddEntryButtonProps = {
  form: UseFormReturnType<PageContent>;
  currentPath: string;
};

function AddEntryButton({ form, currentPath }: AddEntryButtonProps) {
  return (
    <Group className={classes.add_entry_button}>
      <Button onClick={() => form.insertListItem(currentPath, "")}>
        Add entry
      </Button>
    </Group>
  );
}
