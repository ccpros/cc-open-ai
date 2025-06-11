import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";


  const docId = await ensureUser({
    user: { _type: "reference", _ref: docId },
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

    { id: docId }

      user: { _type: "reference", _ref: docId },
  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

    { id: docId }
      user: { _type: "reference", _ref: docId },
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
