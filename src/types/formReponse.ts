export type FormResponse = {
  validated: boolean;
  formErrors: { [k: string]: string };
  recaptchaVerified: boolean;
  submitError?: boolean;
};

export type ContactFormResponse = FormResponse & {
  sendSuccess: boolean;
};

export type LoginFormResponse = FormResponse & {
  sessionCreated: boolean;
};
