export type ContactFormValues = {
  name: string;
  email: string;
  phone: string | null;
  jobDetails: string;
  website?: string;
};

export type LoginFormValues = {
  username: string;
  password: string;
  website?: string;
};
