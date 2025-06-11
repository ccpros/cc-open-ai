import { client } from "@/app/sanity/client";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await client.fetch(
    '*[_type=="post" && _id==$id][0]{ _id, title, content }',
    { id: params.id }
  );

  if (!post) return <div className="container mx-auto py-10">Post not found</div>;

  return <EditPostForm post={post} />;
}
