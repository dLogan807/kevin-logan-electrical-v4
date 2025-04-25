//Schemas for MongoDB collections (validation performed server side via MongoDB Atlas)

export type MongoSchemas =
  | typeof HomeMongoSchema
  | typeof AboutUsMongoSchema
  | typeof RateAndServicesMongoSchema
  | typeof ContactUsMongoSchema;

export const HomeMongoSchema = {
  bsonType: "object",
  title: "Home Object Validation",
  required: ["tagline", "summary", "review_name_filter"],
  properties: {
    tagline: {
      bsonType: "object",
      required: ["title", "subtitle", "description", "button_text"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        subtitle: {
          bsonType: "string",
          description: "'subtitle' must be a string - Required",
        },
        description: {
          bsonType: "string",
          description: "'description' must be a string - Required",
        },
        button_text: {
          bsonType: "string",
          description: "'button_text' must be a string - Required",
        },
      },
    },
    summary: {
      bsonType: "object",
      required: ["title", "items"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        items: {
          bsonType: "array",
          description: "'items' must be an array of strings - Required",
          items: {
            bsonType: "string",
          },
        },
      },
    },
    review_name_filter: {
      bsonType: "array",
      description:
        "'review_name_filter' must be an array of strings - Required",
      items: {
        bsonType: "string",
      },
    },
  },
};

export const AboutUsMongoSchema = {
  bsonType: "object",
  title: "About Us Object Validation",
  required: ["top_section", "bottom_section"],
  properties: {
    top_section: {
      bsonType: "object",
      required: ["text", "button_text"],
      properties: {
        text: {
          bsonType: "string",
          description: "'text' must be a string - Required",
        },
        button_text: {
          bsonType: "string",
          description: "'button_text' must be a string - Required",
        },
      },
    },
    bottom_section: {
      bsonType: "object",
      required: ["text"],
      properties: {
        text: {
          bsonType: "string",
          description: "'text' must be a string - Required",
        },
      },
    },
  },
};

export const RateAndServicesMongoSchema = {
  bsonType: "object",
  title: "Rate and Services Object Validation",
  required: ["rate", "estimates", "services"],
  properties: {
    rate: {
      bsonType: "object",
      required: ["title", "text"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        text: {
          bsonType: "string",
          description: "'text' must be a string - Required",
        },
      },
    },
    estimates: {
      bsonType: "object",
      required: ["title", "text"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        text: {
          bsonType: "string",
          description: "'text' must be a string - Required",
        },
      },
    },
    services: {
      bsonType: "object",
      required: ["title", "description", "categories"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        description: {
          bsonType: "string",
          description: "'description' must be a string - Required",
        },
        categories: {
          bsonType: "object",
          required: ["interior", "exterior", "renovations_and_maintenance"],
          properties: {
            interior: {
              bsonType: "array",
              description: "'interior' must be an array of strings - Required",
              items: {
                bsonType: "string",
              },
            },
            exterior: {
              bsonType: "array",
              description: "'exterior' must be an array of strings - Required",
              items: {
                bsonType: "string",
              },
            },
            renovations_and_maintenance: {
              bsonType: "array",
              description:
                "'renovations_and_maintenance' must be an array of strings - Required",
              items: {
                bsonType: "string",
              },
            },
          },
        },
      },
    },
  },
};

export const ContactUsMongoSchema = {
  bsonType: "object",
  title: "Contact Us Object Validation",
  required: ["contact_details", "service_hours"],
  properties: {
    contact_details: {
      bsonType: "object",
      required: ["title", "location", "phone", "mobile", "email"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        location: {
          bsonType: "string",
          description: "'location' must be a string - Required",
        },
        phone: {
          bsonType: "string",
          description: "'phone' must be a string - Required",
        },
        mobile: {
          bsonType: "string",
          description: "'mobile' must be a string - Required",
        },
        email: {
          bsonType: "string",
          description: "'email' must be a string - Required",
        },
      },
    },
    service_hours: {
      bsonType: "object",
      required: ["title", "hours", "days"],
      properties: {
        title: {
          bsonType: "string",
          description: "'title' must be a string - Required",
        },
        hours: {
          bsonType: "string",
          description: "'hours' must be a string - Required",
        },
        days: {
          bsonType: "string",
          description: "'days' must be a string - Required",
        },
      },
    },
  },
};
