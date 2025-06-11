import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

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

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const profileId = await client.fetch(
    '*[_type=="profile" && user._ref==$id][0]._id',
    { id: docId }
  );
  if (!profileId) {
    await ensureUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
    });
    const created = await client.create({
      _type: "profile",
      user: { _type: "reference", _ref: docId },
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
