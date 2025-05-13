export const UserMongoSchema = {
  bsonType: "object",
  title: "User Object Validation",
  required: ["_id", "username"],
  properties: {
    _id: { bsonType: "objectId" },
    username: {
      bsonType: "string",
      minLength: 5,
      description:
        "'username' must be a string with minimum length of 5 characters - Required",
    },
  },
  additionalProperties: false,
};

export const SessionMongoSchema = {
  bsonType: "object",
  title: "Session Object Validation",
  required: ["_id", "user_id", "expires_at"],
  properties: {
    _id: { bsonType: "objectId" },
    user_id: {
      bsonType: "int",
      description: "'user_id' must be an integer - Required",
    },
    expires_at: {
      bsonType: "date",
      description: "'expires_at' must be a date - Required",
    },
  },
  additionalProperties: false,
};
