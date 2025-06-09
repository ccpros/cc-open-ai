'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    handle: '',
    bio: '',
    jobTitle: '',
    company: '',
    website: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.fullName,
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign up failed');
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Invalid verification code');
    }
  };

  if (!isLoaded) return null;

  if (pendingVerification) {
    return (
      <div className="container mx-auto max-w-md py-10 space-y-4">
        <h1 className="text-xl font-bold">Verify your email</h1>
        {error && <p className="text-destructive">{error}</p>}
        <form onSubmit={onVerify} className="space-y-4">
          <Input type="text" name="code" placeholder="Verification code" value={code} onChange={(e) => setCode(e.target.value)} />
          <Button type="submit" className="w-full">Verify Email</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-10 space-y-4">
      <h1 className="text-2xl font-bold">Create your account</h1>
      {error && <p className="text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <Input name="fullName" type="text" placeholder="Full name" value={form.fullName} onChange={handleChange} />
        <Input name="handle" type="text" placeholder="Handle" value={form.handle} onChange={handleChange} />
        <Input name="jobTitle" type="text" placeholder="Job title" value={form.jobTitle} onChange={handleChange} />
        <Input name="company" type="text" placeholder="Company" value={form.company} onChange={handleChange} />
        <Input name="website" type="url" placeholder="Website" value={form.website} onChange={handleChange} />
        <Input name="location" type="text" placeholder="Location" value={form.location} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </div>
  );
}
