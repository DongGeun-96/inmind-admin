import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { reportId, action, targetType, targetId, targetUserId } = await request.json();
    const supabase = createAdminClient();

    if (action === 'resolve') {
      // 1. 콘텐츠 삭제
      if (targetType === 'post') {
        await supabase.from('posts').delete().eq('id', targetId);
      } else {
        await supabase.from('comments').delete().eq('id', targetId);
      }

      // 2. 작성자 차단 (관리자는 차단하지 않음)
      let banned = false;
      if (targetUserId) {
        const { data: targetUser } = await supabase
          .from('users')
          .select('role')
          .eq('id', targetUserId)
          .single();
        if (targetUser?.role !== 'admin') {
          await supabase.from('users').update({ is_banned: true }).eq('id', targetUserId);
          banned = true;
        }
      }

      // 3. 신고 처리 완료
      const { error } = await supabase
        .from('reports')
        .update({ is_handled: true })
        .eq('id', reportId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, banned });
    } else {
      // 반려: 처리 완료만 표시
      const { error } = await supabase
        .from('reports')
        .update({ is_handled: true })
        .eq('id', reportId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, banned: false });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}
