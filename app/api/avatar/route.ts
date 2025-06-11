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
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return new NextResponse("No file", { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  const profileId = await client.fetch(
    '*[_type=="profile" && user._ref==$id][0]._id',
    { id: user.id }
  );
  if (!profileId) {
    const created = await client.create({
      _type: "profile",
      user: { _type: "reference", _ref: user.id },
      avatar: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    });
    return NextResponse.json({ profile: created });
  }

  const updated = await client
    .patch(profileId)
    .set({
      avatar: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  return NextResponse.json({ profile: updated });
}
