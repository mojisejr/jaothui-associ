import { defineType, defineField } from "sanity";

export const contentType = defineType({
  name: "content",
  title: "Content",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Content Title",
      type: "string",
      validation: (Role) => Role.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),

    defineField({
      name: "video_url",
      title: "Video Url",
      type: "url",
      description: "eg. youtube url.",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
