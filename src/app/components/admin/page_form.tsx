import { PageContent } from "@/actions/mongodb/db_handler";
import {
  PageFormProvider,
  usePageForm,
  usePageFormContext,
} from "./form_context";
import React, { useEffect } from "react";
import { UseFormReturnType } from "@mantine/form";
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export function PageForm({ initialContent }: { initialContent: PageContent }) {
  const form = usePageForm({
    mode: "uncontrolled",
  });

  useEffect(() => {
    form.setInitialValues(initialContent);
    form.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  return (
    <PageFormProvider form={form}>
      <form
        onSubmit={form.onSubmit(() => {
          console.log(form.getValues());
        })}
      >
        <FormContent content={form.getValues()} />
      </form>
    </PageFormProvider>
  );
}

function FormContent({ content }: { content: PageContent }): React.ReactNode {
  const form = usePageFormContext();
  const objectContent = Object.entries(content);

  return (
    <>
      {getObjectEntries(objectContent, "", form)}
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
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
            onClick={() => {
              form.removeListItem(path, Number(key));
            }}
          >
            <IconTrash size={16} />
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
