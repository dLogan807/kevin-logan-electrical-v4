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

interface PageDocument {
  page_content: PageContent;
  date_created: Date;
  auto_created: boolean;
}

//Cached page content retrieval
export const getPageContent = cache(
  async <T extends PageContent>(
    collectionName: Pages,
    fallbackContent: T
  ): Promise<T> => {
    const contentDocument: PageDocument | null =
      await new PageManager().getPageDocument(collectionName);

    //Return fallback content if database content is null
    return contentDocument && contentDocument.page_content
      ? (contentDocument.page_content as T)
      : fallbackContent;
  }
);

//Update (add) latest page content
export async function addPageDocument(
  collectionName: Pages,
  pageContent: PageContent
): Promise<boolean> {
  //auth
  const { session } = await getCurrentSession();
  if (session === null) return false;

  return await new PageManager().addPageDocumentByUser(
    collectionName,
    pageContent
  );
}

//Latest page content retrieval
export async function getStoredPageContent(
  collectionName: Pages
): Promise<PageContent | null> {
  const { session } = await getCurrentSession();
  if (session === null) return null;

  const contentDocument: PageDocument | null =
    await new PageManager().getPageDocument(collectionName);

  return contentDocument?.page_content
    ? (contentDocument.page_content as PageContent)
    : null;
}

class PageManager {
  private pageCollectionsInit: boolean = false;

  private getPageSchema(collectionName: Pages): PageSchema {
    const schema = pageSchemaMap[collectionName];
    if (!schema) {
      throw new Error("Collection must be a valid page.");
    }
    return schema;
  }

  private getPageFallbackContent(collectionName: Pages): PageContent {
    const fallbackContent = pageFallbackContentMap[collectionName];
    if (!fallbackContent) {
      throw new Error("Collection must be a valid page.");
    }
    return fallbackContent;
  }

  private async insertFallbackContent(collectionName: Pages): Promise<boolean> {
    if (!collectionName) return false;
    if (await MongoDatabase.collectionExists(collectionName)) return true;

    const document = {
      page_content: this.getPageFallbackContent(collectionName),
      date_created: new Date(),
      auto_created: true,
    };

    return MongoDatabase.addDocument(collectionName, document);
  }

  //Create all collections for defined pages
  async initPageCollections(): Promise<boolean> {
    var allCreated: boolean = true;

    for (const collectionName of Object.values(Pages)) {
      if (!(await MongoDatabase.collectionExists(collectionName))) {
        const schema: PageSchema = this.getPageSchema(collectionName);

        if (!(await this.initSuccess(collectionName, schema)))
          allCreated = false;
      }
    }

    this.pageCollectionsInit = allCreated;

    return allCreated;
  }

  //Create and add fallback document
  async initSuccess(collectionName: Pages, schema: PageSchema) {
    return (
      (await MongoDatabase.createCollection(collectionName, schema)) &&
      (await this.insertFallbackContent(collectionName))
    );
  }

  //Retrieve the most recent document from the page's collection
  async getPageDocument(collectionName: Pages): Promise<PageDocument | null> {
    if (!collectionName) return null;
    //Attempt to create collections in case they don't exist
    if (!this.pageCollectionsInit) await this.initPageCollections();

    return await MongoDatabase.getLatestDocument<PageDocument>(collectionName);
  }

  //Add a document (latest doc will display on website)
  async addPageDocumentByUser(
    collectionName: Pages,
    pageContent: PageContent
  ): Promise<boolean> {
    if (!collectionName || !pageContent) return false;

    const { session } = await getCurrentSession();
    if (session === null) return false;

    const document: PageDocument = {
      page_content: pageContent,
      date_created: new Date(),
      auto_created: false,
    };

    return await MongoDatabase.addDocument<PageDocument>(
      collectionName,
      document
    );
  }
}
