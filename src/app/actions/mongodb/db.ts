import {
  DeleteResult,
  MongoClient,
  ObjectId,
  ServerApiVersion,
  UpdateResult,
} from "mongodb";

type FieldValue = ObjectId | string | number;

export interface JoinMatchInput {
  localCollection: string;
  localField: string;
  localMatchFieldName: string;
  matchWithValue: FieldValue;
  foreignCollection: string;
  foreignField: string;
}

//Singleton class for MongoDB database operations
class MongoDatabase {
  private static _instance: MongoDatabase;

  private readonly _uri: string = "" + process.env.MONGO_DB_URI;
  private readonly _client: MongoClient = new MongoClient(this._uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });
  private readonly _db = this._client.db("website_content");

  private readonly noDocUpdatesCollections: string[] = [
    "home",
    "about_us",
    "rate_and_services",
    "contact_us",
    "users",
  ];
  private readonly immutableCollections: string[] = ["users"];

  private MongoDatabase() {}

  //Singleton pattern
  static get Instance() {
    return this._instance || (this._instance = new MongoDatabase());
  }

  //------ Helper Functions ------

  private isValidString(input: string): boolean {
    return typeof input === "string" && input.length > 0;
  }

  private isValidFieldValue(value: FieldValue): boolean {
    return (
      value instanceof ObjectId ||
      typeof value === "number" ||
      (typeof value === "string" && value.length > 0)
    );
  }

  private isInArray(stringArray: string[], searchValue: string): boolean {
    if (
      !this.isValidString(searchValue) ||
      stringArray == null ||
      stringArray.length == 0
    )
      return false;

    stringArray.forEach((collection) => {
      if (collection === searchValue) return true;
    });

    return false;
  }

  //Check if docs in collection can be updated/deleted
  private isNoUpdateCollection(collectionName: string): boolean {
    return this.isInArray(this.noDocUpdatesCollections, collectionName);
  }

  //Check if collection can have any docs added/updated/deleted
  private isImmutableCollection(collectionName: string): boolean {
    return this.isInArray(this.immutableCollections, collectionName);
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    if (!this.isValidString(collectionName)) return false;

    try {
      return await this._db.listCollections({ name: collectionName }).hasNext();
    } catch {
      return false;
    }
  }

  //Ensure of correct type
  private async isValidJoinMatchInput(input: JoinMatchInput) {
    if (!input) return false;

    const inputDefined: boolean =
      input &&
      this.isValidString(input.localCollection) &&
      this.isValidString(input.localField) &&
      this.isValidString(input.localMatchFieldName) &&
      this.isValidString(input.foreignCollection) &&
      this.isValidString(input.foreignField);
    if (!inputDefined) return false;

    if (!this.isValidFieldValue(input.matchWithValue)) return false;

    const collectionsExist: boolean =
      (await this.collectionExists(input.localCollection)) &&
      (await this.collectionExists(input.foreignCollection));

    return collectionsExist;
  }

  //------ Database functions ------

  //Create collection with document validation schema
  async createCollection(
    collectionName: string,
    schema: any
  ): Promise<boolean> {
    if (await this.collectionExists(collectionName)) return true;
    if (!schema) return false;

    try {
      await this._db.createCollection(collectionName, {
        validator: {
          $jsonSchema: schema,
        },
      });
    } catch {
      return false;
    }

    return true;
  }

  async getDocument(collectionName: string, fields: any): Promise<any | null> {
    if (!(await this.collectionExists(collectionName))) return null;

    try {
      return await this._db.collection(collectionName).findOne(fields);
    } catch {
      return null;
    }
  }

  //Retrieve the most recent document from the collection
  async getLatestDocument(collectionName: string): Promise<any | null> {
    if (!(await this.collectionExists(collectionName))) return null;

    try {
      return await this._db.collection(collectionName).findOne(
        {},
        {
          sort: { $natural: -1 },
        }
      );
    } catch {
      return null;
    }
  }

  //Perform 1-1 inner join matching id
  async getJoinedDocumentMatchingValue(
    input: JoinMatchInput
  ): Promise<any | null> {
    if (!this.isValidJoinMatchInput(input)) return null;

    //Create aggregation pipeline
    const pipeline = [];
    pipeline.push({
      $match: {
        [input.localMatchFieldName]: input.matchWithValue,
      },
    });
    pipeline.push({
      $lookup: {
        from: input.foreignCollection,
        localField: input.localField,
        foreignField: input.foreignField,
        as: "joined_document",
      },
    });
    pipeline.push({
      $match: {
        joined_document: { $ne: [] },
      },
    });

    //Execute
    try {
      const aggregationResult = this._db
        .collection(input.localCollection)
        .aggregate(pipeline);

      return await aggregationResult.next();
    } catch {
      return null;
    }
  }

  //Add document to existing collection. Validated via schema
  async addDocument(collectionName: string, document: any): Promise<boolean> {
    if (!(await this.collectionExists(collectionName)) || !document)
      return false;

    if (this.isImmutableCollection(collectionName)) {
      throw new Error(
        "Cannot add document. " + collectionName + " is immutable."
      );
    }

    try {
      await this._db.collection(collectionName).insertOne(document);
    } catch {
      return false;
    }

    return true;
  }

  //Set a document field to a new value
  async updateDocumentField(
    collectionName: string,
    fieldToMatch: string,
    matchFieldValue: FieldValue,
    fieldToUpdate: string,
    newValue: any
  ): Promise<boolean> {
    if (
      !this.collectionExists(collectionName) ||
      !this.isValidString(fieldToMatch) ||
      !this.isValidFieldValue(matchFieldValue) ||
      !this.isValidString(fieldToUpdate)
    )
      return false;

    if (this.isNoUpdateCollection(collectionName)) {
      throw new Error("Documents in " + collectionName + " cannot be updated.");
    }

    const filter = {
      [fieldToMatch]: matchFieldValue,
    };

    const updateDocument = {
      $set: {
        [fieldToUpdate]: newValue,
      },
    };

    try {
      const updateResult: UpdateResult = await this._db
        .collection(collectionName)
        .updateOne(filter, updateDocument);

      return updateResult.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  //Set a document field to a new value
  async deleteDocument(
    collectionName: string,
    fieldToMatch: string,
    matchFieldValue: FieldValue,
    deleteAllMatches?: boolean
  ): Promise<boolean> {
    if (
      !this.collectionExists(collectionName) ||
      !this.isValidString(fieldToMatch) ||
      !this.isValidFieldValue(matchFieldValue)
    ) {
      return false;
    }

    if (this.isNoUpdateCollection(collectionName)) {
      throw new Error("Documents in " + collectionName + " cannot be deleted.");
    }

    const document = {
      [fieldToMatch]: matchFieldValue,
    };

    const collection = this._db.collection(collectionName);

    try {
      const deleteResult: DeleteResult = deleteAllMatches
        ? await collection.deleteMany(document)
        : await collection.deleteOne(document);

      return deleteResult.deletedCount > 0;
    } catch {
      return false;
    }
  }

  async closeConnection(): Promise<boolean> {
    try {
      await this._client.close();
      return true;
    } catch {
      return false;
    }
  }
}

export default MongoDatabase.Instance;
