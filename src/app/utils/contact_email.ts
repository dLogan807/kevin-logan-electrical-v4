import { ContactFormData } from "@/components/contact_form";

export type ResponseMessage = {
  success: boolean;
  message: string;
  details: string;
};

export async function sendContactEmail(
  data: ContactFormData
): Promise<ResponseMessage> {
  const apiEndpoint = "/api/contactemail";

  const responseMessage: ResponseMessage = await fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json().then((data) => ({ isOK: res.ok, body: data })))
    .then((response) => {
      if (response.isOK) {
        return {
          success: true,
          message: "Email sent. We'll get back to you shortly!",
          details: response.body.message,
        };
      } else {
        return {
          success: false,
          message: "Could not send the email. Please try again.",
          details: response.body.error,
        };
      }
    })
    .catch((err) => {
      return {
        success: false,
        message: "A server error occured. Please try again.",
        details: err,
      };
    });

  return responseMessage;
}
