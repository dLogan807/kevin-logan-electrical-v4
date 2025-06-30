export const RateLimitSchema = {
  bsonType: "object",
  title: "Schema Object Validation",
  required: ["_id", "requestType", "count", "resetDate"],
  properties: {
    _id: { bsonType: "objectId" },
    requestType: {
      bsonType: "string",
      description: "'requestType' must be a string - Required",
    },
    count: {
      bsonType: "number",
      description: "'count' must be a number - Required",
    },
    resetDate: {
      bsonType: "date",
      description: "'resetDate' must be a number - Required",
    },
  },
  additionalProperties: false,
};
