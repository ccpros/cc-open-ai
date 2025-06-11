import Link from "next/link";
import { client } from "@/app/sanity/client";

export default async function PostsPage() {
  const posts = await client.fetch(
    `*[_type=='post']|order(createdAt desc){
      _id,title,createdAt,
      "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
    }`
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>
      <ul className="space-y-4">
        {posts.map((post: any) => (
          <li key={post._id} className="border p-4 rounded">
            <h2 className="font-semibold">
              <Link href={`/posts/${post._id}`}>{post.title}</Link>
            </h2>
            {post.author && (
              <p className="text-sm text-muted-foreground">
                by {post.author.handle ? (
                  <Link href={`/users/${post.author.handle}`}>{post.author.fullName}</Link>
                ) : (
                  post.author.fullName
                )}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
