import { MongoClient, ServerApiVersion } from "mongodb";

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
  private readonly _databaseName: string = "website_content";

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

  async collectionExists(collectionName: string): Promise<boolean> {
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

  //Create collection with document validation schema
  async createCollection(
    collectionName: string,
    schema: any
  ): Promise<boolean> {
    if (!collectionName || !schema) return false;

    try {
      await this._client
        .db(this._databaseName)
        .createCollection(collectionName, {
          validator: {
            $jsonSchema: {
              schema,
            },
          },
        });
    } catch {
      return false;
    }

    return true;
  }

  //Retrieve the most recent document from the collection
  async getLatestDocument(collectionName: string): Promise<any | null> {
    if (!collectionName || !(await this.collectionExists(collectionName)))
      return null;

    try {
      return await this._client
        .db(this._databaseName)
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

  //Add document to existing collection. Validated via schema
  async addDocument(collectionName: string, document: any): Promise<boolean> {
    if (
      !collectionName ||
      !document ||
      !(await this.collectionExists(collectionName))
    )
      return false;

    try {
      await this._client
        .db(this._databaseName)
        .collection(collectionName)
        .insertOne({
          document,
        });
    } catch {
      return false;
    }

    return true;
  }
}

export default MongoDatabase.Instance;
