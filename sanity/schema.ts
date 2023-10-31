import { type SchemaTypeDefinition } from "sanity";
import { eventType } from "./schemas/event";
import { contentType } from "./schemas/content";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, contentType],
};
