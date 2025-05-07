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
import { IconTrash } from "@tabler/icons-react";

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
      {getObjectEntries(objectContent, "", form)}
      <Group justify="flex-end" mt="md">
        <Tooltip label="Submit and update website content">
          <Button type="submit">Submit</Button>
        </Tooltip>
      </Group>
    </form>
  );
}

function isNumber(value: string): boolean {
  return value != null && !isNaN(Number(value)) && value.trim() !== "";
}

//Recursively generate form fields from entries
function getObjectEntries(
  contentObject: [string, any][],
  path: string,
  form: UseFormReturnType<PageContent>
): React.ReactNode {
  return contentObject.map(([key, value]) => {
    var currentPath: string = path === "" ? key : path + "." + key;

    //If the value is a parent. Add button if parent is a list
    if (typeof value === "object" && value !== null) {
      return (
        <Fieldset legend={key} key={form.key(currentPath)}>
          {getObjectEntries(Object.entries(value), currentPath, form)}
          {Array.isArray(value) ? (
            <Group justify="center" mt="md">
              <Button onClick={() => form.insertListItem(currentPath, "")}>
                Add item
              </Button>
            </Group>
          ) : (
            <></>
          )}
        </Fieldset>
      );
    }

    //If value is part of a list
    if (isNumber(key)) {
      const listNum: Number = Number(key) + 1;

      return (
        <Group key={key}>
          <TextInput
            key={form.key(currentPath)}
            {...form.getInputProps(currentPath)}
            label={"" + listNum}
            placeholder={"Text for " + listNum}
          />
          <ActionIcon
            color="red"
            aria-label="Remove"
            onClick={() => {
              form.removeListItem(path, Number(key));
            }}
          >
            <IconTrash size={16} aria-label="Delete icon" />
          </ActionIcon>
        </Group>
      );
    }

    return (
      <Textarea
        key={form.key(currentPath)}
        {...form.getInputProps(currentPath)}
        label={key}
        placeholder={"Text for " + key}
        rows={1}
        autosize={true}
      />
    );
  });
}
