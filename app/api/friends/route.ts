import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export async function GET() {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const friends = await client.fetch(
    `*[_type=="friendship" && ((user._ref==$id && status=='accepted') || (friend._ref==$id && status=='accepted'))]{
      _id,status,
      "user": user->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle},
      "friend": friend->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
    }`,
    { id: docId }
  );

  return NextResponse.json({ friends });
}
