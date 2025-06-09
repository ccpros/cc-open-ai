import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "8n5iznjt",
  dataset: "production",
  apiVersion: "2025-06-09",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();

  const userDoc = {
    _type: "user",
    _id: user.id,
    clerkId: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: data.fullName,
    role: "user",
  };

  const profileDoc = {
    _type: "profile",
    user: { _type: "reference", _ref: user.id },
    handle: data.handle,
    bio: data.bio,
    jobTitle: data.jobTitle,
    company: data.company,
    website: data.website,
    location: data.location,
  };

  await client.createIfNotExists(userDoc);
  await client.createIfNotExists(profileDoc);

  return NextResponse.json({ ok: true });
}
