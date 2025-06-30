export const RateLimitSchema = {
  bsonType: "object",
  title: "Schema Object Validation",
  required: ["_id", "requestType", "count", "resetDate"],
  properties: {
    _id: { bsonType: "objectId" },
    requestType: {
      bsonType: "string",
      description: "'ip' must be a string - Required",
      unique: true,
    },
    count: {
      bsonType: "number",
      description: "'count' must be a number - Required",
    },
    resetDate: {
      bsonType: "Date",
      description: "'resetDate' must be a number - Required",
    },
  },
  additionalProperties: false,
};
