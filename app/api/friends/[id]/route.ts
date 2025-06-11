import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const existing = await client.fetch(
    '*[_type=="friendship" && user._ref==$user && friend._ref==$friend][0]',
    { user: docId, friend: params.id }
  );
  if (existing) return NextResponse.json({ friendship: existing });

  const friendship = await client.create({
    _type: "friendship",
    user: { _type: "reference", _ref: docId },
    friend: { _type: "reference", _ref: params.id },
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ friendship });
}

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const friendship = await client.fetch(
    '*[_type=="friendship" && _id==$id][0]',
    { id: params.id }
  );
  if (!friendship) return new NextResponse("Not Found", { status: 404 });
  if (friendship.friend._ref !== docId)
    return new NextResponse("Forbidden", { status: 403 });

  const updated = await client.patch(params.id).set({ status: "accepted" }).commit();

  return NextResponse.json({ friendship: updated });
}
