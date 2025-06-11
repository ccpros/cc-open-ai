import { createClient } from "next-sanity"

export const client = createClient({
  projectId: "8n5iznjt",
  dataset: "production",
  apiVersion: "2025-06-09",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
