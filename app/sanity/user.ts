import { client } from "./client"

export async function ensureUser(user: { id: string; email?: string | null; fullName?: string | null }) {
  const docId = `user_${user.id}`
  const userDoc = {
    _type: "user",
    _id: docId,
    clerkId: user.id,
    email: user.email,
    fullName: user.fullName,
    role: "user",
  }
  await client.createIfNotExists(userDoc)
  return docId
}
