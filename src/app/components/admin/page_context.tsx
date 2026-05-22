"use client";

import { PageContent } from "@/actions/mongodb/pages/management";
import { Box, Loader } from "@mantine/core";
import {
  createContext,
  ReactElement,
  ReactNode,
  Suspense,
  useContext,
} from "react";

import classes from "./page_context.module.css";

export const PageContext = createContext<Promise<PageContent | null> | null>(
  null,
);

export function PageContentProvider({
  children,
  pageContentPromise,
}: {
  children: ReactNode;
  pageContentPromise: Promise<PageContent | null>;
}) {
  const fallbackLoader: ReactElement = (
    <Box className={classes.loader_container}>
      <Loader type="bars" />
    </Box>
  );

  return (
    <Suspense fallback={fallbackLoader}>
      <PageContext value={pageContentPromise}>{children}</PageContext>
    </Suspense>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageContentProvider");
  }
  return context;
}
