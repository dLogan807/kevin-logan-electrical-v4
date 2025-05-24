export const UserMongoSchema = {
  bsonType: "object",
  title: "User Object Validation",
  required: ["_id", "username"],
  properties: {
    _id: { bsonType: "objectId" },
    username: {
      bsonType: "string",
      minLength: 7,
      description:
        "'username' must be a string with minimum length of 7 characters - Required",
    },
  },
  additionalProperties: false,
};

export const SessionMongoSchema = {
  bsonType: "object",
  title: "Session Object Validation",
  required: ["_id", "session_id", "user_id", "expires_at"],
  properties: {
    _id: { bsonType: "objectId" },
    session_id: {
      bsonType: "string",
      minLength: 64,
      maxLength: 64,
      description: "'session_id' must be a string of length 64 - Required",
    },
    user_id: {
      bsonType: "objectId",
      description: "'user_id' must be an objectId - Required",
    },
    expires_at: {
      bsonType: "date",
      description: "'expires_at' must be a date - Required",
    },
  },
  additionalProperties: false,
};
