import { NextResponse, type NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await client.fetch(
    `*[_type=="post" && _id==$id][0]{
      _id,title,content,createdAt,
      "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
    }`,
    { id: params.id }
  );
  if (!post) return new NextResponse("Not Found", { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const post = await client.fetch(
    '*[_type=="post" && _id==$id][0]{"authorId": author._ref}',
    { id: params.id }
  );
  if (!post) return new NextResponse("Not Found", { status: 404 });
  const docId = `user_${user.id}`;
  if (post.authorId !== docId)
    return new NextResponse("Forbidden", { status: 403 });

  const data = await req.json();
  const updated = await client
    .patch(params.id)
    .set({ title: data.title, content: data.content })
    .commit();

  return NextResponse.json({ post: updated });
}
