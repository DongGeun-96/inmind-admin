'use client';

import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { PageHeader, Card, Table, CellBold, Badge, ActionGroup, ActionButton, Empty, Button } from '@/components/ui';
import type { User } from '@/types/database';
import styles from './virtual-users.module.css';

export default function VirtualUsersClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState('');

  const handleCreate = async () => {
    if (!nickname.trim()) return;
    setLoading(true);

    const res = await fetch('/api/virtual-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname: nickname.trim() }),
    });

    if (res.ok) {
      const { user } = await res.json();
      setUsers([user, ...users]);
      setNickname('');
    } else {
      const { error } = await res.json();
      alert(error || '계정 생성에 실패했어요.');
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`"${name}" 가상 계정을 삭제하시겠어요?`)) return;

    const res = await fetch('/api/virtual-users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert('삭제에 실패했어요.');
    }
  };

  const handleEdit = async (userId: string) => {
    if (!editNickname.trim()) return;

    const res = await fetch('/api/virtual-users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, nickname: editNickname.trim() }),
    });

    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, nickname: editNickname.trim() } : u));
      setEditingId(null);
      setEditNickname('');
    } else {
      alert('수정에 실패했어요.');
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditNickname(user.nickname);
  };

  return (
    <>
      <PageHeader title="가상 계정 관리" />

      <Card>
        <div className={styles.createForm}>
          <input
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className={styles.input}
            maxLength={20}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={loading || !nickname.trim()}>
            <Plus size={14} /> {loading ? '생성 중...' : '계정 생성'}
          </Button>
        </div>
      </Card>

      <Card>
        <Table heads={['닉네임', '생성일', '구분', '관리']}>
          {users.map(u => (
            <tr key={u.id}>
              <CellBold>
                {editingId === u.id ? (
                  <div className={styles.editRow}>
                    <input
                      type="text"
                      value={editNickname}
                      onChange={e => setEditNickname(e.target.value)}
                      className={styles.editInput}
                      maxLength={20}
                      onKeyDown={e => e.key === 'Enter' && handleEdit(u.id)}
                      autoFocus
                    />
                    <button className={styles.iconBtn} onClick={() => handleEdit(u.id)}><Check size={14} /></button>
                    <button className={styles.iconBtn} onClick={() => setEditingId(null)}><X size={14} /></button>
                  </div>
                ) : (
                  u.nickname
                )}
              </CellBold>
              <td>{u.created_at?.slice(0, 10)}</td>
              <td><Badge variant="info">가상</Badge></td>
              <td>
                <ActionGroup>
                  <ActionButton variant="default" onClick={() => startEdit(u)}>
                    <Pencil size={13} /> 수정
                  </ActionButton>
                  <ActionButton variant="danger" onClick={() => handleDelete(u.id, u.nickname)}>
                    <Trash2 size={13} /> 삭제
                  </ActionButton>
                </ActionGroup>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr><td colSpan={4}><Empty>가상 계정이 없어요</Empty></td></tr>
          )}
        </Table>
      </Card>
    </>
  );
}
