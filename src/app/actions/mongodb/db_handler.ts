"use server";

import { MongoClient, ServerApiVersion } from "mongodb";
import { Pages } from "@/components/layout/pages";
import { fallbackContent as homeFallbackContent, HomeText } from "@/page";
import {
  fallbackContent as aboutUsFallbackContent,
  AboutUsText,
} from "@/aboutus/page";
import {
  fallbackContent as rateAndServicesFallbackContent,
  RateAndServicesText,
} from "@/rateandservices/page";
import {
  fallbackContent as contactUsFallbackContent,
  ContactUsText,
} from "@/contactus/page";
import {
  HomeMongoSchema,
  AboutUsMongoSchema,
  RateAndServicesMongoSchema,
  ContactUsMongoSchema,
} from "./schemas";

//Exported functions for server actions
export async function setupMongoDatabase(): Promise<boolean> {
  return await MongoDatabase.Instance.createCollections();
}

export async function getPageDocument(collectionName: Pages): Promise<boolean> {
  return await MongoDatabase.Instance.getPageDocument(collectionName);
}

export async function closeConnection(): Promise<any | null> {
  return await MongoDatabase.Instance.closeConnection();
}

//Singleton class for MongoDB database operations
class MongoDatabase {
  private static _instance: MongoDatabase;

  private readonly uri: string = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=kevin-logan-electrical`;
  private readonly client: MongoClient = new MongoClient(this.uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  private readonly databaseName = "website_content";
  private databaseExists: boolean = false;

  private MongoDatabase() {}

  //Singleton pattern
  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  async closeConnection(): Promise<boolean> {
    console.log("Closing connection to MongoDB");
    try {
      await this.client.close();
      return true;
    } catch {
      return false;
    }
  }

  private async collectionExists(collectionName: Pages): Promise<boolean> {
    try {
      return await this.client
        .db(this.databaseName)
        .listCollections({ name: collectionName })
        .hasNext();
    } catch {
      return false;
    }
  }

  private getSchema(collectionName: Pages): any {
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
    pageContent: HomeText | AboutUsText | RateAndServicesText | ContactUsText
  ): Promise<boolean> {
    if (this.databaseExists) return false;

    try {
      await this.client
        .db(this.databaseName)
        .collection(collectionName)
        .insertOne(pageContent);
    } catch {
      return false;
    }

    return true;
  }

  //Create collection and insert default content
  private async createCollection(collectionName: Pages): Promise<boolean> {
    if (this.databaseExists) return false;

    const schema = this.getSchema(collectionName);
    const fallbackContent = this.getPageFallbackContent(collectionName);
    if (!schema || !fallbackContent) return false;

    try {
      await this.client.db(this.databaseName).createCollection(collectionName, {
        validator: {
          $jsonSchema: schema,
        },
      });

      await this.insertFallbackContent(collectionName, fallbackContent);
    } catch {
      return false;
    }

    return true;
  }

  //Create all collections for defined pages
  async createCollections(): Promise<boolean> {
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
    try {
      return await this.client
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
}
