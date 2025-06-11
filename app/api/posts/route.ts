import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const data = await req.json();
  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const postDoc = {
    _type: "post",
    author: { _type: "reference", _ref: docId },
    title: data.title,
    content: data.content,
    createdAt: new Date().toISOString(),
  };

  const created = await client.create(postDoc);
  return NextResponse.json({ post: created });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const query = userId
    ? `*[_type=="post" && author._ref==$id]|order(createdAt desc){
        _id,title,content,createdAt,
        "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
      }`
    : `*[_type=="post"]|order(createdAt desc){
        _id,title,content,createdAt,
        "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
      }`;
  const posts = await client.fetch(query, { id: userId });
  return NextResponse.json({ posts });
}
