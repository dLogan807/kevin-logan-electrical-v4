"use server";

import MongoDatabase from "../db_handler";
import { Pages } from "@/components/layout/pages";
import {
  HomeMongoSchema,
  AboutUsMongoSchema,
  RateAndServicesMongoSchema,
  ContactUsMongoSchema,
  PageSchema,
} from "@/actions/mongodb/pages/page_schemas";
import { fallbackContent as homeFallbackContent, HomeContent } from "@/page";
import {
  fallbackContent as aboutUsFallbackContent,
  AboutUsContent,
} from "@/aboutus/page";
import {
  fallbackContent as rateAndServicesFallbackContent,
  RateAndServicesContent,
} from "@/rateandservices/page";
import {
  fallbackContent as contactUsFallbackContent,
  ContactUsContent,
} from "@/contactus/page";
import { cache } from "react";

export type PageContent =
  | HomeContent
  | AboutUsContent
  | RateAndServicesContent
  | ContactUsContent;

interface PageDocument {
  page_content: PageContent;
  date_created: Date;
  auto_created: boolean;
}

//Cached page content retrieval
export const getPageContent = cache(
  async (
    collectionName: Pages,
    fallbackContent: PageContent
  ): Promise<PageContent> => {
    const contentDocument: PageDocument | null =
      await new PageManager().getPageDocument(collectionName);

    //Return fallback content if database content is retrieved as null
    return contentDocument && contentDocument.page_content
      ? (contentDocument.page_content as PageContent)
      : fallbackContent;
  }
);

//Page content retrieval
export async function getStoredPageContent(
  collectionName: Pages
): Promise<PageContent | null> {
  const contentDocument: PageDocument | null =
    await new PageManager().getPageDocument(collectionName);

  return contentDocument && contentDocument.page_content
    ? (contentDocument.page_content as PageContent)
    : null;
}

class PageManager {
  private pageCollectionsInit: boolean = false;

  private getPageSchema(collectionName: Pages): PageSchema {
    if (!collectionName || !Object.values(Pages).includes(collectionName)) {
      throw Error("Collection must be a valid page.");
    }

    switch (collectionName) {
      case Pages.Home:
        return HomeMongoSchema;
      case Pages.AboutUs:
        return AboutUsMongoSchema;
      case Pages.RateAndServices:
        return RateAndServicesMongoSchema;
      case Pages.ContactUs:
        return ContactUsMongoSchema;
    }
  }

  private getPageFallbackContent(collectionName: Pages): PageContent {
    if (!collectionName || !Object.values(Pages).includes(collectionName))
      throw Error("Collection must be a valid page.");

    switch (collectionName) {
      case Pages.Home:
        return homeFallbackContent;
      case Pages.AboutUs:
        return aboutUsFallbackContent;
      case Pages.RateAndServices:
        return rateAndServicesFallbackContent;
      case Pages.ContactUs:
        return contactUsFallbackContent;
    }
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

    return MongoDatabase.getLatestDocument(collectionName);
  }

  //Private currently as admin page not yet created
  private async addPageDocumentByUser(
    collectionName: Pages,
    pageContent: PageContent
  ): Promise<boolean> {
    if (!collectionName || !pageContent) return false;

    const document: PageDocument = {
      page_content: pageContent,
      date_created: new Date(),
      auto_created: false,
    };

    return await MongoDatabase.addDocument(collectionName, document);
  }
}
