import { createClient } from '@/utils/supabase/server';

export async function getServerSideProps(context) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: { user },
  };
}
