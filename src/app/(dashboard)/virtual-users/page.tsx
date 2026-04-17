import { createAdminClient } from '@/lib/supabase-admin';
import VirtualUsersClient from './VirtualUsersClient';

export const dynamic = 'force-dynamic';

export default async function VirtualUsersPage() {
  const supabase = createAdminClient();

  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('is_virtual', true)
    .order('created_at', { ascending: false });

  return <VirtualUsersClient users={users || []} />;
}
