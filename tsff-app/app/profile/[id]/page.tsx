// app/users/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import LogoutButton from './logout-button';

export default function UserProfile() {
  const { id } = useParams();

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {id}</p>
      {/* Render user-specific content based on the ID */}
      <LogoutButton />
    </div>
  );
}   
