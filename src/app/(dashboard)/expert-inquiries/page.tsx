import { createAdminClient } from '@/lib/supabase-admin';
import ExpertInquiriesClient from './ExpertInquiriesClient';

export const dynamic = 'force-dynamic';

export default async function ExpertInquiriesPage() {
  const supabase = createAdminClient();

  const { data: inquiries } = await supabase
    .from('expert_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return <ExpertInquiriesClient inquiries={inquiries || []} />;
}
