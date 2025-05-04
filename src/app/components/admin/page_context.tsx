"use client";

import { PageContent } from "@/actions/mongodb/db_handler";
import React, { createContext, useContext } from "react";

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
    <PageContext.Provider value={pageContentPromise}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageContentProvider");
  }
  return context;
}
