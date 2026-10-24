import {
  AboutUsContent,
  ContactUsContent,
  HomeContent,
  RateAndServicesContent,
} from "@/types/pageContent";

export const HomeFallback: HomeContent = {
  tagline: {
    title: "Your Trusted Local Electrician",
    subtitle: "30 years of experience you can rely on",
    description:
      "At Kevin Logan Electrical, we believe in providing a competent, professional, and courteous electrical service. Striving to give you results of the highest quality is at our forefront.",
    button_text: "Get in touch",
  },
  summary: {
    title: "Our Service",
    items: [
      "Based in Torbay, North Shore",
      "Professional, Friendly & Approachable",
      "Wide Range of Residential Services",
      "Affordable $90/hr incl. GST",
      "Independent",
      "Committed to Sustainability",
      "Satisfaction Guaranteed",
    ],
  },
  review_name_filter: [],
};

export const AboutUsFallback: AboutUsContent = {
  top_section: {
    text: "I founded Kevin Logan Electrical in 1992 and have since been proudly serving the North Shore community. Based in Torbay, you can count on me as your local electrician.",
    button_text: "Registered Electrician",
  },
  bottom_section: {
    text: "I specialise in residential work, offering a competent and reliable electrical service you can count on. In addition, with my friendly and professional manner, I can answer any questions you may have about my business or services. I pride myself on quality workmanship and professional service from repairs and maintenance to installations. \n\n At Kevin Logan Electrical, my goal is to provide you with a courteous, prompt, professional service of the highest calibre.",
  },
};

export const RateAndServicesFallback: RateAndServicesContent = {
  rate: {
    title: "Standard Rate",
    text: "Hourly rate — $90/hr incl. GST. Please note an additional travel charge dependent on mileage.",
  },
  estimates: {
    title: "Estimates",
    text: "Please call if you would like an estimate on the cost of a job. Often the price indicated over the phone is very close to the actual cost of the job. When the job is complete, an itemised invoice is given listing the materials used plus additional labour costs.",
  },
  services: {
    title: "Services",
    description:
      "I offer a wide range of residential services. If you'd like to inquire about a particular job, don't hesitate to give me a call.",
    categories: {
      interior: [
        "Lighting",
        "Powerpoints",
        "Hot water faults",
        "Hood / Fan installations",
        "Fault-finding",
      ],
      exterior: [
        "Outdoor lighting / Sockets",
        "Garden lighting",
        "Security lights",
        "Swimming pools / Spa pools",
        "Sub mains to exterior buildings",
        "EV charge stations",
      ],
      renovations_and_maintenance: [
        "Switchboard upgrades",
        "Oven / Hob repairs",
        "Complete rewires",
        "Kitchens",
        "Bathrooms",
      ],
    },
  },
};

export const ContactUsFallback: ContactUsContent = {
  contact_details: {
    title: "Contact Details",
    location: "Based in Torbay, servicing the North Shore",
    phone: "09 473 9712",
    mobile: "0274 978 473",
    email: "kevinlog@kevinloganelectrical.co.nz",
  },
  service_hours: {
    title: "Service Hours",
    hours: "8 AM - 5 PM",
    days: "Monday - Friday",
  },
};
