"use client";

import { PageContent } from "@/actions/mongodb/pages/management";
import { Box, Loader } from "@mantine/core";
import React, { createContext, Suspense, useContext } from "react";

import classes from "./page_context.module.css";

export const PageContext = createContext<Promise<PageContent | null> | null>(
  null
);

export function PageContentProvider({
  children,
  pageContentPromise,
}: {
  children: React.ReactNode;
  pageContentPromise: Promise<PageContent | null>;
}) {
  const fallbackLoader: React.ReactElement = (
    <Box className={classes.loader_container}>
      <Loader type="bars" />
    </Box>
  );

  return (
    <Suspense fallback={fallbackLoader}>
      <PageContext.Provider value={pageContentPromise}>
        {children}
      </PageContext.Provider>
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
