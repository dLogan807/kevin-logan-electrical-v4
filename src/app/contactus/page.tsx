import { Metadata } from "next";
import { headers } from "next/headers";
import { Pages } from "@/enums/pages";
import { getPageContent } from "@/actions/mongodb/pages/management";
import ContactUsClient from "@/components/routeClients/ContactUsClient/ContactUsClient";
import { ContactUsContent } from "@/actions/mongodb/pages/fallback_content";

export const metadata: Metadata = {
  title: "Contact Us | Kevin Logan Electrical - Your Trusted Electrician",
  description:
    "Contact Kevin Logan Electrical. Open Monday to Friday, don't hesitate to give me call for a reliable service of the highest calibre.",
};

export default async function ContactUs() {
  const nonce = (await headers()).get("x-nonce") || "";

  const content = await getPageContent<ContactUsContent>(Pages.ContactUs);

  return <ContactUsClient content={content} nonce={nonce} />;
}
