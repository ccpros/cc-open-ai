import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();

  await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: data.fullName,
  });

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

  const created = await client.createIfNotExists(profileDoc);

  return NextResponse.json({ profile: created });
}

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let profile = await client.fetch(
    '*[_type=="profile" && user._ref==$id][0]',
    { id: user.id }
  );

  if (!profile) {
    await ensureUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
    });
    profile = await client.create({
      _type: "profile",
      user: { _type: "reference", _ref: user.id },
    });
  }

  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();
  const profileId = await client.fetch(
    '*[_type=="profile" && user._ref==$id][0]._id',
    { id: user.id }
  );

  if (!profileId) {
    await ensureUser({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      fullName: user.fullName,
    });
    const created = await client.create({
      _type: "profile",
      user: { _type: "reference", _ref: user.id },
      ...data,
    });
    return NextResponse.json({ profile: created });
  }

  const updated = await client.patch(profileId).set(data).commit();

  return NextResponse.json({ profile: updated });
}
