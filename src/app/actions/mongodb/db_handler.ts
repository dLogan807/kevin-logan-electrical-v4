"use server";

import { MongoClient, ServerApiVersion } from "mongodb";
import { Pages } from "@/components/layout/pages";
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
import {
  HomeMongoSchema,
  AboutUsMongoSchema,
  RateAndServicesMongoSchema,
  ContactUsMongoSchema,
  MongoSchemas,
} from "@/actions/mongodb/schemas";
import { cache } from "react";

type PageContent =
  | HomeContent
  | AboutUsContent
  | RateAndServicesContent
  | ContactUsContent;

interface PageDocument {
  page_content: PageContent;
  date_created: Date;
  auto_created: boolean;
}

//Page content retrieval
export const getPageContent = cache(
  async (
    collectionName: Pages,
    fallbackContent: PageContent
  ): Promise<PageContent> => {
    const contentDocument: PageDocument | null =
      await MongoDatabase.Instance.getPageDocument(collectionName);

    //Return fallback content if database content is retrieved as null
    return contentDocument && contentDocument.page_content
      ? (contentDocument.page_content as PageContent)
      : fallbackContent;
  }
);

export async function closeConnection(): Promise<boolean> {
  return await MongoDatabase.Instance.closeConnection();
}

//Singleton class for MongoDB database operations
class MongoDatabase {
  private static _instance: MongoDatabase;

  private readonly _uri: string = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=kevin-logan-electrical`;
  private readonly _client: MongoClient = new MongoClient(this._uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });
  private readonly _databaseName: string = "website_content";
  private _databaseExists: boolean = false;

  private MongoDatabase() {}

  //Singleton pattern
  static get Instance() {
    return this._instance || (this._instance = new MongoDatabase());
  }

  async closeConnection(): Promise<boolean> {
    try {
      await this._client.close();
      return true;
    } catch {
      return false;
    }
  }

  private async collectionExists(collectionName: Pages): Promise<boolean> {
    if (!collectionName) return false;

    try {
      return await this._client
        .db(this._databaseName)
        .listCollections({ name: collectionName })
        .hasNext();
    } catch {
      return false;
    }
  }

  private getPageSchema(collectionName: Pages): MongoSchemas | null {
    if (!collectionName) return null;

    switch (collectionName) {
      case Pages.Home:
        return HomeMongoSchema;
      case Pages.AboutUs:
        return AboutUsMongoSchema;
      case Pages.RateAndServices:
        return RateAndServicesMongoSchema;
      case Pages.ContactUs:
        return ContactUsMongoSchema;
      default:
        return null;
    }
  }

  private getPageFallbackContent(collectionName: Pages): PageContent | null {
    if (!collectionName) return null;

    switch (collectionName) {
      case Pages.Home:
        return homeFallbackContent;
      case Pages.AboutUs:
        return aboutUsFallbackContent;
      case Pages.RateAndServices:
        return rateAndServicesFallbackContent;
      case Pages.ContactUs:
        return contactUsFallbackContent;
      default:
        return null;
    }
  }

  private async insertFallbackContent(
    collectionName: Pages,
    pageContent: PageContent
  ): Promise<boolean> {
    if (!collectionName || !pageContent || this._databaseExists) return false;

    try {
      await this._client
        .db(this._databaseName)
        .collection(collectionName)
        .insertOne({
          page_content: pageContent,
          date_created: new Date(),
          auto_created: true,
        });
    } catch {
      return false;
    }

    return true;
  }

  //Create collection and insert fallback content
  private async createCollection(collectionName: Pages): Promise<boolean> {
    if (!collectionName || this._databaseExists) return false;

    const schema = this.getPageSchema(collectionName);
    const fallbackContent = this.getPageFallbackContent(collectionName);
    if (!schema || !fallbackContent) return false;

    try {
      await this._client
        .db(this._databaseName)
        .createCollection(collectionName, {
          validator: {
            $jsonSchema: {
              bsonType: "object",
              required: ["page_content", "date_created", "auto_created"],
              properties: {
                page_content: schema,
                date_created: {
                  bsonType: "date",
                },
                auto_created: {
                  bsonType: "bool",
                },
              },
            },
          },
        });

      await this.insertFallbackContent(collectionName, fallbackContent);
    } catch {
      return false;
    }

    return true;
  }

  //Create all collections for defined pages
  async createPageCollections(): Promise<boolean> {
    if (this._databaseExists) return true;
    var allCreated: boolean = true;

    for (const collectionName of Object.values(Pages)) {
      if (!(await this.collectionExists(collectionName))) {
        var success: boolean = await this.createCollection(collectionName);
        if (!success) allCreated = false;
      }
    }

    this._databaseExists = true;
    return allCreated;
  }

  //Retrieve the most recent document from the page's collection
  async getPageDocument(collectionName: Pages): Promise<PageDocument | null> {
    //Attempt to create collections in case they don't exist
    if (!this._databaseExists) await this.createPageCollections();
    if (!collectionName) return null;

    try {
      return await this._client
        .db(this._databaseName)
        .collection<PageDocument>(collectionName)
        .findOne(
          {},
          {
            sort: { $natural: -1 },
          }
        );
    } catch {
      return null;
    }
  }

  //Private currently as admin page not yet created
  private async addPageDocumentByUser(
    collectionName: Pages,
    pageContent: PageContent
  ): Promise<boolean> {
    if (!collectionName || !pageContent) return false;

    try {
      await this._client
        .db(this._databaseName)
        .collection(collectionName)
        .insertOne({
          page_content: pageContent,
          date_created: new Date(),
          auto_created: false,
        });
    } catch {
      return false;
    }

    return true;
  }
}
