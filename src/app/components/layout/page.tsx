import { Pages } from "./pages";

export class Page {
  readonly name: Pages;
  readonly mongoValidationSchema: JSON;

  constructor(name: Pages, validationSchema: JSON) {
    this.name = name;
    this.mongoValidationSchema = validationSchema;
  }
}
