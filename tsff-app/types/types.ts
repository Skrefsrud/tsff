import { User } from "@supabase/supabase-js";

export type UserRole = {
  roleId: string;
  roleName: string;
};

export interface Session {
  user: User & {
    role: string; // Example: additional fields from your API
    confirmed_at: string | null;
    last_sign_in_at: string | null;
    created_at: string;
    updated_at: string;
  };
  // Additional fields from your API or logic
  profile?: {
    avatar_url?: string;
    name?: string;
  };
  roles?: string[];
}

export type Team = {
  id: string;
  name: string;
  logo_url?: string;
  social_links: { [platform: string]: string };
};
