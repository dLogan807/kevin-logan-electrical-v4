"use server";

import MongoDatabase from "../db";
import { Pages } from "@/components/layout/pages";
import {
  HomeMongoSchema,
  AboutUsMongoSchema,
  RateAndServicesMongoSchema,
  ContactUsMongoSchema,
  PageSchema,
} from "@/actions/mongodb/pages/schemas";
import {
  HomeFallback,
  HomeContent,
  AboutUsFallback,
  AboutUsContent,
  RateAndServicesFallback,
  RateAndServicesContent,
  ContactUsFallback,
  ContactUsContent,
} from "@/actions/mongodb/pages/fallback_content";
import { cache } from "react";
import { getCurrentSession } from "../sessions/cookie";

interface PageDocument<T extends PageContent> {
  page_content: T;
  date_created?: Date;
  auto_created?: boolean;
}

export type PageContent =
  | HomeContent
  | AboutUsContent
  | RateAndServicesContent
  | ContactUsContent;

const pageSchemaMap: Record<Pages, PageSchema> = {
  [Pages.Home]: HomeMongoSchema,
  [Pages.AboutUs]: AboutUsMongoSchema,
  [Pages.RateAndServices]: RateAndServicesMongoSchema,
  [Pages.ContactUs]: ContactUsMongoSchema,
};

const pageFallbackContentMap: Record<Pages, PageContent> = {
  [Pages.Home]: HomeFallback,
  [Pages.AboutUs]: AboutUsFallback,
  [Pages.RateAndServices]: RateAndServicesFallback,
  [Pages.ContactUs]: ContactUsFallback,
};

function getPageFallbackContent<T extends PageContent>(page: Pages): T {
  const fallback = pageFallbackContentMap[page] as T;
  if (!fallback) {
    throw new Error("Collection must be a valid page.");
  }
  return fallback;
}

//Cached page content retrieval
export const getPageContent = cache(
  async <T extends PageContent>(page: Pages): Promise<T> => {
    const contentDocument = await new PageManager().getPageDocument<T>(page);

    const fallbackContent = getPageFallbackContent<T>(page);

    return contentDocument?.page_content ?? fallbackContent;
  },
);

//Update (add) latest page content
export async function addPageDocument(
  collectionName: Pages,
  pageContent: PageContent,
): Promise<boolean> {
  //auth
  const { session } = await getCurrentSession();
  if (session === null) return false;

  return await new PageManager().addPageDocumentByUser(
    collectionName,
    pageContent,
  );
}

//Latest page content retrieval
export async function getStoredPageContent<T extends PageContent>(
  collectionName: Pages,
): Promise<T | null> {
  const { session } = await getCurrentSession();
  if (session === null) return null;

  const contentDocument: PageDocument<T> | null =
    await new PageManager().getPageDocument(collectionName);

  return contentDocument?.page_content ?? null;
}

class PageManager {
  private pageCollectionsInit = false;

  private async insertFallbackContent<T extends PageContent>(
    page: Pages,
  ): Promise<boolean> {
    if (!page) return false;
    if (await MongoDatabase.collectionExists(page)) return true;

    const document = {
      page_content: getPageFallbackContent<T>(page),
      date_created: new Date(),
      auto_created: true,
    };

    return MongoDatabase.addDocument(page, document);
  }

  //Create all collections for defined pages
  async initPageCollections() {
    for (const page of Object.values(Pages)) {
      if (!(await MongoDatabase.collectionExists(page))) {
        const schema = pageSchemaMap[page];

        if (!(await this.initSuccess(page, schema))) {
          // Fail early to show fallback content
          this.pageCollectionsInit = true;
          return;
        }
      }
    }
  }

  //Create and add fallback document
  async initSuccess(collectionName: Pages, schema: PageSchema) {
    return (
      (await MongoDatabase.createCollection(collectionName, schema)) &&
      (await this.insertFallbackContent(collectionName))
    );
  }

  //Retrieve the most recent document from the page's collection
  async getPageDocument<T extends PageContent>(
    page: Pages,
  ): Promise<PageDocument<T> | null> {
    //Attempt to create collections in case they don't exist
    if (!this.pageCollectionsInit) await this.initPageCollections();

    const pageDocument =
      await MongoDatabase.getLatestDocument<PageDocument<T>>(page);

    if (!pageDocument) return null;

    const { ...document } = pageDocument;

    return document;
  }

  //Add a document (latest doc will display on website)
  async addPageDocumentByUser<T extends PageContent>(
    collectionName: Pages,
    pageContent: T,
  ): Promise<boolean> {
    if (!collectionName || !pageContent) return false;

    const { session } = await getCurrentSession();
    if (session === null) return false;

    const document: PageDocument<T> = {
      page_content: pageContent,
      date_created: new Date(),
      auto_created: false,
    };

    return await MongoDatabase.addDocument<PageDocument<T>>(
      collectionName,
      document,
    );
  }
}
