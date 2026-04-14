import { createAdminClient } from '@/lib/supabase-admin';
import ReportsClient from './ReportsClient';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const supabase = createAdminClient();

  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const enriched = await Promise.all(
    (reports || []).map(async (r) => {
      let target_content: string | null = null;
      let target_user_id: string | null = null;

      if (r.target_type === 'post') {
        const { data } = await supabase
          .from('posts')
          .select('title, user_id')
          .eq('id', r.target_id)
          .single();
        if (data) {
          target_content = data.title;
          target_user_id = data.user_id;
        }
      } else {
        const { data } = await supabase
          .from('comments')
          .select('content, user_id')
          .eq('id', r.target_id)
          .single();
        if (data) {
          target_content = data.content;
          target_user_id = data.user_id;
        }
      }

      let target_user_nickname: string | null = null;
      if (target_user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('nickname')
          .eq('id', target_user_id)
          .single();
        target_user_nickname = user?.nickname || null;
      }

      return { ...r, target_content, target_user_id, target_user_nickname };
    })
  );

  return <ReportsClient reports={enriched} />;
}
