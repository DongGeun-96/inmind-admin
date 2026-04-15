import { createAdminClient } from '@/lib/supabase-admin';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const supabase = createAdminClient();

  const [{ data: users }, { data: authData }] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const authMap = new Map(
    (authData?.users ?? []).map(u => [u.id, !!u.email_confirmed_at])
  );

  const usersWithEmail = (users || []).map(u => ({
    ...u,
    is_email_confirmed: authMap.get(u.id) ?? false,
  }));

  return <UsersClient users={usersWithEmail} />;
}
