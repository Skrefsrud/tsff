import { getServerSession } from "@/utils/supabase/session";

export default async function App() {
  const user = await getServerSession();

  if (!user) {
    return <p>No user session found</p>;
  }

  return <p>Welcome, {user.email}</p>;
}
