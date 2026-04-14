import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('users').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { userId } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { userId, is_banned } = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('users')
      .update({ is_banned })
      .eq('id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}
