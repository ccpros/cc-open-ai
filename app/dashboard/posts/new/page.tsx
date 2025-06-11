import CreatePostForm from '@/components/CreatePostForm'

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      <CreatePostForm />
    </div>
  )
}
