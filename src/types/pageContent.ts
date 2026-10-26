import { Document } from "mongodb";

export type PageContent =
  HomeContent | AboutUsContent | RateAndServicesContent | ContactUsContent;

export interface HomeContent extends Document {
  tagline: {
    title: string;
    subtitle: string;
    description: string;
    button_text: string;
  };
  summary: {
    title: string;
    items: string[];
  };
  review_name_filter: string[];
}

export interface AboutUsContent extends Document {
  top_section: {
    text: string;
    button_text: string;
  };
  bottom_section: {
    text: string;
  };
}

export interface RateAndServicesContent extends Document {
  rate: {
    title: string;
    text: string;
  };
  estimates: {
    title: string;
    text: string;
  };
  services: {
    title: string;
    description: string;
    categories: {
      interior: string[];
      exterior: string[];
      renovations_and_maintenance: string[];
    };
  };
}

export interface ContactUsContent extends Document {
  contact_details: {
    title: string;
    location: string;
    phone: string;
    mobile: string;
    email: string;
  };
  service_hours: {
    title: string;
    hours: string;
    days: string;
  };
}
