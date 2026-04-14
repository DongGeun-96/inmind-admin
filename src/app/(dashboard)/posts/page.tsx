import { createAdminClient } from '@/lib/supabase-admin';
import PostsClient from './PostsClient';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const supabase = createAdminClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, user:users(nickname)')
    .order('created_at', { ascending: false })
    .limit(100);

  return <PostsClient posts={posts || []} />;
}
