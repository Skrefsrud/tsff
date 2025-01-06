// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export async function GET() {
  try {
    // Fetch all users from the `profiles` table
    const { data, error } = await supabase.from('profiles').select('id, name');

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    return NextResponse.json({ users: data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
