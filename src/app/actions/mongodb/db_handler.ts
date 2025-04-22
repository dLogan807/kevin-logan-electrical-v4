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
} from "./schemas";
import { cache } from "react";

export interface PageDocument {
  page_content: any;
  date_created: Date;
  auto_created: boolean;
}

//Page content retrieval (cached - cache may not work here)
export const getPageDocument = cache(
  async (collectionName: Pages): Promise<PageDocument | null> => {
    return await MongoDatabase.Instance.getPageDocument(collectionName);
  }
);

export async function closeConnection(): Promise<boolean> {
  return await MongoDatabase.Instance.closeConnection();
}

async function getMongoUri(): Promise<string> {
  if (
    !process.env.MONGO_DB_USERNAME ||
    !process.env.MONGO_DB_PASSWORD ||
    !process.env.MONGO_DB_CLUSTER
  ) {
    throw new Error("Missing required MongoDB environment variables");
  }

  return `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=kevin-logan-electrical`;
}

//Get the MongoDB client. Server function to avoid exposing env values
async function getMongoClient(): Promise<MongoClient> {
  return getMongoUri().then(
    (uri) =>
      new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      })
  );
}

//Singleton class for MongoDB database operations
class MongoDatabase {
  private static _instance: MongoDatabase;

  private readonly client: Promise<MongoClient> = getMongoClient();
  private readonly databaseName = "website_content";
  private databaseExists: boolean = false;

  private MongoDatabase() {}

  //Singleton pattern
  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async closeConnection(): Promise<boolean> {
    try {
      await (await this.client).close();
      return true;
    } catch {
      return false;
    }
  }

  private async collectionExists(collectionName: Pages): Promise<boolean> {
    try {
      return await (await this.client)
        .db(this.databaseName)
        .listCollections({ name: collectionName })
        .hasNext();
    } catch {
      return false;
    }
  }

  private getPageSchema(collectionName: Pages): any {
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

  private getPageFallbackContent(collectionName: Pages): any {
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
    pageContent:
      | HomeContent
      | AboutUsContent
      | RateAndServicesContent
      | ContactUsContent
  ): Promise<boolean> {
    if (this.databaseExists) return false;

    try {
      await (await this.client)
        .db(this.databaseName)
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
    if (this.databaseExists) return false;

    const schema = this.getPageSchema(collectionName);
    const fallbackContent = this.getPageFallbackContent(collectionName);
    if (!schema || !fallbackContent) return false;

    try {
      await (await this.client)
        .db(this.databaseName)
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
    if (this.databaseExists) return true;
    var allCreated: boolean = true;

    for (const collectionName of Object.values(Pages)) {
      if (!(await this.collectionExists(collectionName))) {
        var success: boolean = await this.createCollection(collectionName);
        if (!success) allCreated = false;
      }
    }

    this.databaseExists = true;
    return allCreated;
  }

  //Retrieve the most recent document from the page's collection
  async getPageDocument(collectionName: Pages): Promise<any | null> {
    //Attempt to create collections in case they don't exist
    if (!this.databaseExists) await this.createPageCollections();

    try {
      return await (
        await this.client
      )
        .db(this.databaseName)
        .collection(collectionName)
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

  //Private & unused currently as admin page not yet created
  private async addPageDocumentByUser(
    collectionName: Pages,
    pageContent: any
  ): Promise<boolean> {
    try {
      await (await this.client)
        .db(this.databaseName)
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
