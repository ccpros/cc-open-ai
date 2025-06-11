'use client';
import { useState } from 'react';
import { Button } from './ui/button';

interface Props {
  targetId: string;
  viewerId: string;
  existing: any;
}

export default function AddFriendButton({
  targetId,
  viewerId,
  existing,
}: Props) {
  const [status, setStatus] = useState(existing?.status || 'idle');

  const sendRequest = async () => {
    const res = await fetch(`/api/friends/${targetId}`, { method: 'POST' });
    if (res.ok) {
      setStatus('pending');
    }
  };

  const acceptRequest = async () => {
    const res = await fetch(`/api/friends/${existing._id}`, { method: 'PUT' });
    if (res.ok) {
      setStatus('accepted');
    }
  };

  if (status === 'accepted') return null;

  if (status === 'pending' && existing?.friendId === viewerId) {
    return <Button onClick={acceptRequest}>Accept Request</Button>;
  }

  return (
    <Button onClick={sendRequest} disabled={status === 'pending'}>
      {status === 'pending' ? 'Request Sent' : 'Add Friend'}
    </Button>
  );
}
