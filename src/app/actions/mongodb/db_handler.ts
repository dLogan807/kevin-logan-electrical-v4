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

const uri: string = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=kevin-logan-electrical`;
const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const databaseName = "website_content";
var databaseExists: boolean = false;

export async function closeConnection(): Promise<boolean> {
  try {
    await client.close();
    return true;
  } catch {
    return false;
  }
}

async function collectionExists(collectionName: Pages): Promise<boolean> {
  try {
    return await client
      .db(databaseName)
      .listCollections({ name: collectionName })
      .hasNext();
  } catch {
    return false;
  }
}

function getPageSchema(collectionName: Pages): any {
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

function getPageFallbackContent(collectionName: Pages): any {
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

async function insertFallbackContent(
  collectionName: Pages,
  pageContent:
    | HomeContent
    | AboutUsContent
    | RateAndServicesContent
    | ContactUsContent
): Promise<boolean> {
  if (databaseExists) return false;

  try {
    await client.db(databaseName).collection(collectionName).insertOne({
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
async function createCollection(collectionName: Pages): Promise<boolean> {
  if (databaseExists) return false;

  const schema = getPageSchema(collectionName);
  const fallbackContent = getPageFallbackContent(collectionName);
  if (!schema || !fallbackContent) return false;

  try {
    await client.db(databaseName).createCollection(collectionName, {
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

    await insertFallbackContent(collectionName, fallbackContent);
  } catch {
    return false;
  }

  return true;
}

//Create all collections for defined pages
async function createPageCollections(): Promise<boolean> {
  if (databaseExists) return true;
  var allCreated: boolean = true;

  for (const collectionName of Object.values(Pages)) {
    if (!(await collectionExists(collectionName))) {
      var success: boolean = await createCollection(collectionName);
      if (!success) allCreated = false;
    }
  }

  databaseExists = true;
  return allCreated;
}

export const getPageDocument = cache(
  async (collectionName: Pages): Promise<PageDocument | null> => {
    //Attempt to create collections in case they don't exist
    if (!databaseExists) await createPageCollections();

    try {
      return (await client
        .db(databaseName)
        .collection(collectionName)
        .findOne(
          {},
          {
            sort: { $natural: -1 },
          }
        )) as PageDocument | null;
    } catch {
      return null;
    }
  }
);

// currently unused as admin page not yet created
// async function addPageDocumentByUser(
//   collectionName: Pages,
//   pageContent: any
// ): Promise<boolean> {
//   try {
//     await client.db(databaseName).collection(collectionName).insertOne({
//       page_content: pageContent,
//       date_created: new Date(),
//       auto_created: false,
//     });
//   } catch {
//     return false;
//   }

//   return true;
// }
