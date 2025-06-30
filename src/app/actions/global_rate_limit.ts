"use server";

import MongoDatabase from "@/actions/mongodb/db";
import { RateLimitSchema } from "./rate_limit/schema";

interface RateLimitDocument {
  requestType: string;
  count: number;
  resetDate: Date;
}

const COLLECTION: string = "global_rate_limit";

export async function rateLimitReached(requestType: string): Promise<boolean> {
  const MAX_MONTLY_REQUESTS: number = 950;
  const DAYS_IN_MONTH: number = 31;
  const MAX_DAILY_REQUESTS: number = MAX_MONTLY_REQUESTS / DAYS_IN_MONTH;

  await MongoDatabase.createCollection(COLLECTION, RateLimitSchema);

  const query = {
    requestType: requestType,
  };

  const rateDocument: RateLimitDocument | null =
    await MongoDatabase.getDocument(COLLECTION, query);

  if (
    !rateDocument ||
    !rateDocument.count ||
    !rateDocument.resetDate ||
    !rateDocument.requestType
  ) {
    const document: RateLimitDocument = {
      requestType: requestType,
      count: 1,
      resetDate: getDateInOneDay(),
    };

    await MongoDatabase.addDocument(COLLECTION, document);

    return true;
  }

  const currentDate = new Date(Date.now());

  if (currentDate > rateDocument.resetDate) {
    await reset(requestType);

    return false;
  }

  if (rateDocument.count > MAX_DAILY_REQUESTS) {
    return true;
  }

  await increment(requestType);

  return false;
}

async function increment(requestType: string) {
  const filter = {
    requestType: requestType,
  };

  const updateDocument = {
    $inc: {
      count: 1,
    },
  };

  MongoDatabase.updateDocument(COLLECTION, filter, updateDocument);
}

async function reset(requestType: string) {
  const filter = {
    requestType: requestType,
  };

  const updateDocument = {
    $set: {
      count: 1,
      resetDate: getDateInOneDay(),
    },
  };

  await MongoDatabase.updateDocument(COLLECTION, filter, updateDocument);
}

function getDateInOneDay(): Date {
  const date: Date = new Date(Date.now());
  date.setDate(date.getDate() + 1);

  return date;
}
