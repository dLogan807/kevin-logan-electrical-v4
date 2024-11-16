import { ContactFormData } from "@/components/contact_form";

export function sendContactEmail(data: ContactFormData) {
  const apiEndpoint = "/api/contactemail";

  fetch(apiEndpoint, {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response.message);
    })
    .catch((err) => {
      console.log(err);
    });
}
