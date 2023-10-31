import { defineType, defineField } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Event Name",
      type: "string",
      validation: (Role) => Role.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),

    defineField({
      name: "images",
      title: "Event Images",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "start",
      title: "Start date",
      type: "date",
    }),

    defineField({
      name: "end",
      title: "End date",
      type: "date",
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
