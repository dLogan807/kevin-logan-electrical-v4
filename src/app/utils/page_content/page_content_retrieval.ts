import { Pages } from "@/components/layout/pages";
import {
  setupMongoDatabase,
  getPageDocument,
} from "@/actions/mongodb/db_handler";

//Called from page client for most recent content
export default async function getPageContent(page: Pages): Promise<any | null> {
  var content: any = null;

  await setupMongoDatabase();

  switch (page) {
    case Pages.Home:
      content = await getPageDocument(Pages.Home);
      break;
    case Pages.AboutUs:
      content = await getPageDocument(Pages.AboutUs);
      break;
    case Pages.RateAndServices:
      content = await getPageDocument(Pages.RateAndServices);
      break;
    case Pages.ContactUs:
      content = await getPageDocument(Pages.ContactUs);
      break;
  }

  return content;
}
