import Header from "@/components/layout/header";
import { getServerSession } from "@/utils/supabase/session";

export default async function App() {
  const session = await getServerSession();
  return (
    <>
      <Header session={session} />
      <h1>HellO!</h1>
    </>
  );
}
