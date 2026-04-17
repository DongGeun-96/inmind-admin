import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase-server';
import { randomUUID } from 'crypto';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient.from('users').select('role').eq('id', user.id).single();
  return profile?.role === 'admin';
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { nickname } = await request.json();
    if (!nickname?.trim()) {
      return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const fakeEmail = `virtual_${randomUUID().slice(0, 8)}@inmind.virtual`;
    const fakePassword = randomUUID();

    // 1. Auth에 유저 생성 (FK 충족용)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: fakeEmail,
      password: fakePassword,
      email_confirm: true,
      user_metadata: { nickname: nickname.trim() },
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || '계정 생성 실패' }, { status: 500 });
    }

    // 2. users 테이블에 is_virtual 플래그 설정
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_virtual: true })
      .eq('id', authData.user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
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

    const { userId, nickname } = await request.json();
    if (!nickname?.trim()) {
      return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('users')
      .update({ nickname: nickname.trim() })
      .eq('id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '요청 처리에 실패했습니다' }, { status: 500 });
  }
}
