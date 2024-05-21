import { defineType, defineField } from "sanity";

export const profileApproveType = defineType({
  name: "profileManagement",
  title: "Profile Management",
  type: "document",
  fields: [
    defineField({
      name: "wallet",
      title: "wallet",
      type: "string",
      validation: (Role) => Role.required(),
    }),

    defineField({
      name: "name",
      title: "name",
      type: "string",
      validation: (Role) => Role.required(),
    }),

    defineField({
      name: "isEdited",
      title: "isEdited",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
