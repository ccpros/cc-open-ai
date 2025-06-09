import { defineType, defineField } from "sanity"

const subscription = defineType({
  name: "subscription",
  title: "Subscription",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
    }),
    defineField({
      name: "plan",
      title: "Plan",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
  ],
})

export default subscription
