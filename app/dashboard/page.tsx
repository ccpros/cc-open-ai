import Link from 'next/link'
import { client } from '@/app/sanity/client'
import CreatePostForm from '@/components/CreatePostForm'

export default async function DashboardPage() {
  const posts = await client.fetch(
    `*[_type=='post']|order(createdAt desc){
      _id,title,content,createdAt,
      "author": author->{fullName,"handle":*[_type=='profile' && user._ref==^._id][0].handle}
    }`
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
  )

  return (
    <div className="relative h-full">
      <div className="absolute inset-x-0 top-0 bottom-36 overflow-y-auto space-y-4 p-4">
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pb-40">
        {posts.map((post: any) => (
          <div key={post._id} className="border rounded p-4 space-y-1">
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
            {post.content && <p className="text-sm">{post.content}</p>}
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t bg-background p-4">

      <div className="absolute bottom-0 inset-x-0 border-t bg-background p-4">
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <CreatePostForm />
      </div>
    </div>
  )

