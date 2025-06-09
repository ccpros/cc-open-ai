import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { schemaTypes } from "./sanity/schema"

export default defineConfig({
  projectId: "8n5iznjt",
  dataset: "production",
  title: "studio-cc-open-ai",
  basePath: "/studio-cc-open-ai",
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
