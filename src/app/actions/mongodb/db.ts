import {
  DeleteResult,
  Document,
  Filter,
  MongoClient,
  OptionalId,
  ServerApiVersion,
  UpdateFilter,
  UpdateResult,
  WithId,
} from "mongodb";

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

  //------ Database functions ------

  //Create collection with document validation schema
  async createCollection(
    collectionName: string,
    schema: Document
  ): Promise<boolean> {
    if (await this.collectionExists(collectionName)) return true;
    if (schema == null) return false;

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

  async getDocument<T = Document>(
    collectionName: string,
    query: Filter<Document>
  ): Promise<WithId<T> | null> {
    if (!(await this.collectionExists(collectionName))) return null;

    try {
      return (await this._db
        .collection(collectionName)
        .findOne(query)) as WithId<T> | null;
    } catch {
      return null;
    }
  }

  //Retrieve the most recent document from the collection
  async getLatestDocument<T = Document>(
    collectionName: string
  ): Promise<WithId<T> | null> {
    if (!(await this.collectionExists(collectionName))) return null;

    const collection = this._db.collection(collectionName);
    try {
      return (await collection.findOne(
        {},
        {
          sort: { $natural: -1 },
        }
      )) as WithId<T> | null;
    } catch {
      return null;
    }
  }

  //Perform 1-1 inner join
  async getInnerJoinedDocument(
    collectionName: string,
    match: Document,
    lookup: Document
  ): Promise<Document | null> {
    if (
      !this.collectionExists(collectionName) ||
      match == null ||
      lookup == null
    ) {
      return null;
    }

    //Create aggregation pipeline
    const pipeline: Document[] = [];
    pipeline.push(match);
    pipeline.push(lookup);
    pipeline.push({
      $match: {
        joined_document: { $ne: [] },
      },
    });

    //Execute
    try {
      const aggregationResult = this._db
        .collection(collectionName)
        .aggregate(pipeline);

      return await aggregationResult.next();
    } catch {
      return null;
    }
  }

  //Add document to existing collection. Validated via schema
  async addDocument<T = Document>(
    collectionName: string,
    document: OptionalId<T>
  ): Promise<boolean> {
    if (!(await this.collectionExists(collectionName)) || document == null)
      return false;

    if (this.isImmutableCollection(collectionName)) {
      throw new Error(
        "Cannot add document. " + collectionName + " is immutable."
      );
    }

    const collection = this._db.collection(collectionName);
    try {
      await collection.insertOne(document as OptionalId<Document>);
    } catch {
      return false;
    }

    return true;
  }

  //Update a document
  async updateDocument(
    collectionName: string,
    query: Filter<Document>,
    document: UpdateFilter<Document>
  ): Promise<boolean> {
    if (
      !this.collectionExists(collectionName) ||
      query == null ||
      document == null
    )
      return false;

    if (this.isNoUpdateCollection(collectionName)) {
      throw new Error("Documents in " + collectionName + " cannot be updated.");
    }

    const collection = this._db.collection(collectionName);
    try {
      const updateResult: UpdateResult = await collection.updateOne(
        query,
        document
      );

      return updateResult.modifiedCount > 0;
    } catch {
      return false;
    }
  }

  //Delete document(s)
  async deleteDocument(
    collectionName: string,
    query: Filter<Document>,
    deleteAllMatches?: boolean
  ): Promise<boolean> {
    if (!this.collectionExists(collectionName) || query == null) return false;

    if (this.isNoUpdateCollection(collectionName)) {
      throw new Error("Documents in " + collectionName + " cannot be deleted.");
    }

    const collection = this._db.collection(collectionName);
    try {
      const deleteResult: DeleteResult = deleteAllMatches
        ? await collection.deleteMany(query)
        : await collection.deleteOne(query);

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
