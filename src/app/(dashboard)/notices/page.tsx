import { createAdminClient } from '@/lib/supabase-admin';
import NoticesClient from './NoticesClient';

export const dynamic = 'force-dynamic';

export default async function NoticesPage() {
  const supabase = createAdminClient();

  const { data: notices } = await supabase
    .from('posts')
    .select('*, user:users(nickname)')
    .eq('is_notice', true)
    .order('created_at', { ascending: false })
    .limit(100);

  return <NoticesClient notices={notices || []} />;
}
