import { defineType, defineField } from "sanity"

const purchase = defineType({
  name: "purchase",
  title: "Purchase",
  type: "document",
  fields: [
    defineField({
      name: "customer",
      title: "Customer",
      type: "reference",
      to: [{ type: "customer" }],
    }),
    defineField({
      name: "item",
      title: "Item",
      type: "string",
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
    }),
    defineField({
      name: "purchasedAt",
      title: "Purchased At",
      type: "datetime",
    }),
  ],
})

export default purchase
