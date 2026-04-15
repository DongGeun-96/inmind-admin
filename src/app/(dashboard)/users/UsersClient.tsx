'use client';

import { useState } from 'react';
import { Ban, CheckCircle, Mail, Trash2 } from 'lucide-react';
import { PageHeader, Card, Table, CellBold, Badge, ActionGroup, ActionButton, Empty } from '@/components/ui';
import type { User } from '@/types/database';

export default function UsersClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [resendingIds, setResendingIds] = useState<Set<string>>(new Set());

  const handleBan = async (userId: string, isBanned: boolean) => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, is_banned: !isBanned }),
    });
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, is_banned: !isBanned } : u));
    }
  };

  const handleDelete = async (userId: string, nickname: string) => {
    if (!confirm(`"${nickname}" 회원을 삭제하시겠어요? 해당 회원의 모든 게시글과 댓글도 함께 삭제됩니다.`)) return;
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert('회원 삭제에 실패했어요.');
    }
  };

  const handleResendVerification = async (userId: string) => {
    setResendingIds(prev => new Set(prev).add(userId));
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'resend_verification' }),
      });
      if (res.ok) {
        alert('인증 메일을 재전송했어요.');
      } else {
        const data = await res.json();
        alert(data.error || '인증 메일 전송에 실패했어요.');
      }
    } finally {
      setResendingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <>
      <PageHeader title="회원 관리" />
      <Card>
        <Table heads={['닉네임', '아이디', '이메일', '가입일', '상태', '관리']}>
          {users.map(u => (
            <tr key={u.id}>
              <CellBold>{u.nickname}</CellBold>
              <td>{u.username || '-'}</td>
              <td>{u.email}</td>
              <td>{u.created_at?.slice(0, 10)}</td>
              <td>
                <Badge variant={u.is_banned ? 'danger' : u.is_email_confirmed ? 'success' : 'warning'}>
                  {u.is_banned ? '차단' : u.is_email_confirmed ? '정상' : '미인증'}
                </Badge>
              </td>
              <td>
                <ActionGroup>
                  {!u.is_email_confirmed && !u.is_banned && (
                    <ActionButton
                      variant="default"
                      onClick={() => handleResendVerification(u.id)}
                      disabled={resendingIds.has(u.id)}
                    >
                      <Mail size={13} /> {resendingIds.has(u.id) ? '전송 중...' : '인증메일 재전송'}
                    </ActionButton>
                  )}
                  <ActionButton
                    variant={u.is_banned ? 'success' : 'danger'}
                    onClick={() => handleBan(u.id, u.is_banned)}
                  >
                    {u.is_banned ? <><CheckCircle size={13} /> 해제</> : <><Ban size={13} /> 차단</>}
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(u.id, u.nickname)}>
                    <Trash2 size={13} /> 삭제
                  </ActionButton>
                </ActionGroup>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={6}><Empty>회원이 없어요</Empty></td></tr>
          )}
        </Table>
      </Card>
    </>
  );
}
