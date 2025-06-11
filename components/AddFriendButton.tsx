'use client';
import { useState } from 'react';
import { Button } from './ui/button';

interface Props {
  targetId: string;
  existing: any;
}

export default function AddFriendButton({ targetId, existing }: Props) {
  const [status, setStatus] = useState(existing?.status || 'idle');

  const sendRequest = async () => {
    const res = await fetch(`/api/friends/${targetId}`, { method: 'POST' });
    if (res.ok) {
      setStatus('pending');
    }
  };

  if (status === 'accepted') return null;

  return (
    <Button onClick={sendRequest} disabled={status === 'pending'}>
      {status === 'pending' ? 'Request Sent' : 'Add Friend'}
    </Button>
  );
}
