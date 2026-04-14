import { createAdminClient } from '@/lib/supabase-admin';
import InquiriesClient from './InquiriesClient';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const supabase = createAdminClient();

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  // user 정보를 별도로 조회해서 합침
  const enriched = await Promise.all(
    (inquiries || []).map(async (inq) => {
      const { data: user } = await supabase
        .from('users')
        .select('nickname, email')
        .eq('id', inq.user_id)
        .single();
      return { ...inq, user: user || null };
    })
  );

  return <InquiriesClient inquiries={enriched} />;
}
