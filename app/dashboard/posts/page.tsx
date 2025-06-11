import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/app/sanity/client";
import { ensureUser } from "@/app/sanity/user";

export default async function MyPostsPage() {
  const user = await currentUser();
  if (!user) return null;
  const docId = await ensureUser({
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName,
  });

  const posts = await client.fetch(
    '*[_type=="post" && author._ref==$id]|order(createdAt desc){ _id,title }',
    { id: docId }
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link href="/dashboard/posts/new" className="underline">
          New Post
        </Link>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {posts.map((post: any) => (
          <li key={post._id}>
            <Link href={`/dashboard/posts/${post._id}/edit`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
