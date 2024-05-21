import { type SchemaTypeDefinition } from "sanity";
import { eventType } from "./schemas/event";
import { contentType } from "./schemas/content";
import { profileApproveType } from "./schemas/profileApprove";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, contentType, profileApproveType],
};
