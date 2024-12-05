'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js'; // Import the User type

export default function ProtectedComponent() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type user as User or null
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient(); // Await the createClient function
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return <p>Welcome, {user.email}</p>;
}
