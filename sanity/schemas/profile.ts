import { defineType, defineField } from "sanity"

const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      description: "Associated Clerk user",
    }),
    defineField({
      name: "handle",
      title: "Handle",
      type: "string",
      description: "Unique profile handle",
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
  ],
})

export default profile
