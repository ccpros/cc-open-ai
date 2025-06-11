'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CreatePostForm() {
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', content: '' })
      router.refresh()
    } else {
      setError('Failed to create post')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="What's on your mind?"
      />
      <Button type="submit" className="w-full">Post</Button>
    </form>
  )
}
