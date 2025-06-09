import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { client } from "@/app/sanity/client"

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const headers = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")
  let evt
  try {
    evt = wh.verify(payload, headers)
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  const event = evt as any
  const data = event.data

  if (event.type === "user.created" || event.type === "user.updated") {
    const { id, email_addresses, first_name, last_name } = data
    await client.createOrReplace({
      _id: `clerk-user-${id}`,
      _type: "user",
      clerkId: id,
      email: email_addresses?.[0]?.email_address || "",
      fullName: [first_name, last_name].filter(Boolean).join(" "),
    })
  }

  return NextResponse.json({ ok: true })
}
