import { defineType, defineField } from "sanity"

const friendship = defineType({
  name: "friendship",
  title: "Friendship",
  type: "document",
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "friend",
      title: "Friend",
      type: "reference",
      to: [{ type: "user" }],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Accepted", value: "accepted" },
        ],
      },
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    }),
  ],
})

export default friendship
