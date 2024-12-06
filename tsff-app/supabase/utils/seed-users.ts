// seed-users.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import * as path from 'path';


const envPath = path.resolve(__dirname, '../../.env.local');
// Load environment variables from .env.local
dotenv.config({ path: envPath, debug: true });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;



if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase URL or Service Role Key is missing.');
}


const supabase = createClient(supabaseUrl, serviceRoleKey);


interface UserSeedData {
    email: string;
    password: string;
  }
  
  const users: UserSeedData[] = [
    { email: 'user1@example.com', password: 'securepassword1' },
    { email: 'user2@example.com', password: 'securepassword2' },
    // Add more users as needed
  ];
  
  const createUser = async ({ email, password }: UserSeedData) => {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm the user's email
    });
  
    if (error) {
      console.error(`Error creating user ${email}:`, error.message);
      return null;
    }
  
    return user;
  };
  
  const seedUsers = async () => {
    for (const userData of users) {
      const user = await createUser(userData);
      if (user) {
        console.log(`User ${user.user.email} created successfully.`);
      }
    }
  };
  
  seedUsers().catch((error) => {
    console.error('Error seeding users:', error);
  });
  