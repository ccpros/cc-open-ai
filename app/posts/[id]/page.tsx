import Link from "next/link";
import { client } from "@/app/sanity/client";

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await client.fetch(
    `*[_type=='post' && _id==$id][0]{
      _id,title,content,createdAt,
      "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
    }`,
    { id: params.id }
  );

  if (!post) return <div className="container mx-auto py-10">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      {post.author && (
        <p className="text-sm text-muted-foreground">
          by {post.author.handle ? (
            <Link href={`/users/${post.author.handle}`}>{post.author.fullName}</Link>
          ) : (
            post.author.fullName
          )}
        </p>
      )}
      <div>{post.content}</div>
    </div>
  );
}
