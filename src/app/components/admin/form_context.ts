import { PageContent } from "@/actions/mongodb/db_handler";
import { createFormContext } from "@mantine/form";

export const [PageFormProvider, usePageFormContext, usePageForm] =
  createFormContext<PageContent>();
