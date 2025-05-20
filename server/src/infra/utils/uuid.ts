import { v4 as uuid } from "uuid";

export class Uuid {
  constructor() {}

  getUuid(): string {
    return uuid();
  }
}
