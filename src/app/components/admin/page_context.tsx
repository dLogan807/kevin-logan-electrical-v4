"use client";

import { PageContent } from "@/actions/mongodb/db_handler";
import { Loader } from "@mantine/core";
import React, { createContext, Suspense, useContext } from "react";

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
  return (
    <Suspense fallback={<Loader type="bars" />}>
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
