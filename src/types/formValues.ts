export type CloudflareTurnstileFormValues = {
  turnstileToken: string;
};

export type ContactFormValues = CloudflareTurnstileFormValues & {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  website?: string;
};

export type LoginFormValues = CloudflareTurnstileFormValues & {
  username: string;
  password: string;
  website?: string;
};
