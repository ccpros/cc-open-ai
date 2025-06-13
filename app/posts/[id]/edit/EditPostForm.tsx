'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditPostForm({ post }: { post: { _id: string; title: string; content: string } }) {
  const [form, setForm] = useState({ title: post.title, content: post.content });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push(`/posts/${post._id}`);
    } else {
      setError('Failed to update post');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      {error && <p className="text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={form.title} onChange={handleChange} />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
