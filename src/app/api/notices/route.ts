import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return null;
  return user.id;
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await checkAdmin();
    if (!adminId) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { boardType, title, content } = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: adminId,
        board_type: boardType,
        title,
        content: `<p>${content.replace(/\n/g, '</p><p>')}</p>`,
        is_notice: true,
        is_anonymous: false,
        is_public: true,
        view_count: 0,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notice: data });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminId = await checkAdmin();
    if (!adminId) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { postId } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('is_notice', true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}
