'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  if (error) {
    console.log("login error: ", error);
    // Handle the error appropriately, e.g., return an error message
    return;
  }
  // Perform the redirect after successful login
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  if (error) redirect('/error');
  redirect('/');
}
