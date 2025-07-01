"use server";

import MongoDatabase from "@/actions/mongodb/db";
import { RateLimitSchema } from "./rate_limit/schema";

interface RateLimitDocument {
  requestType: string;
  count: number;
  resetDate: Date;
}

const COLLECTION: string = "global_rate_limit";

//Check and increment rate limit
export async function rateLimitReached(requestType: string): Promise<boolean> {
  const MAX_MONTLY_REQUESTS: number = 930;
  const DAYS_IN_MONTH: number = 31;
  const MAX_DAILY_REQUESTS: number = MAX_MONTLY_REQUESTS / DAYS_IN_MONTH;

  await MongoDatabase.createCollection(COLLECTION, RateLimitSchema);

  const query = {
    requestType: requestType,
  };

  const rateDocument: RateLimitDocument | null =
    await MongoDatabase.getDocument(COLLECTION, query);

  //No document exists or is missing fields
  if (
    !rateDocument ||
    rateDocument.count === null ||
    rateDocument.resetDate === null ||
    rateDocument.requestType === null
  ) {
    const document: RateLimitDocument = {
      requestType: requestType,
      count: 1,
      resetDate: getDateInOneDay(),
    };

    await MongoDatabase.addDocument(COLLECTION, document);

    return true;
  }

  //Reset is due
  const currentDate = new Date(Date.now());
  if (currentDate > rateDocument.resetDate) {
    await reset(requestType);

    return false;
  }

  //Requests exceeded
  if (rateDocument.count >= MAX_DAILY_REQUESTS) {
    return true;
  }

  //If increment failed, prevent usage
  const incrementFailed: boolean = !(await increment(requestType));
  return incrementFailed;
}

//Increment rate limit
async function increment(requestType: string): Promise<boolean> {
  const filter = {
    requestType: requestType,
  };

  const updateDocument = {
    $inc: {
      count: 1,
    },
  };

  return MongoDatabase.updateDocument(COLLECTION, filter, updateDocument);
}

//Reset limit
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

//Returns the date-time a day from now
function getDateInOneDay(): Date {
  const date: Date = new Date(Date.now());
  date.setDate(date.getDate() + 1);

  return date;
}
