import CreatePostForm from '@/components/CreatePostForm'

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      <CreatePostForm />
    </div>
  )

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewPostPage() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/posts/${data.post._id}`);
    } else {
      setError('Failed to create post');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Post</h1>
      {error && <p className="text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
