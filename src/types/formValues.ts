export type ContactFormValues = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  website?: string;
  "cf-turnstile-response"?: string;
};

export type LoginFormValues = {
  username: string;
  password: string;
  website?: string;
  "cf-turnstile-response"?: string;
};
