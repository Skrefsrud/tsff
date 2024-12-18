import Header from "@/components/layout/header";
import { getServerSession } from "@/utils/supabase/session";

export default async function App() {
  const session = await getServerSession();
  console.log(session);

  if (!session) {
    return <p>No user session found</p>;
  }

  return (
    <>
      <Header />
      <p>Welcome, {session.user.email}</p>
    </>
  );
}
