'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import { BOARD_CONFIG, type BoardType, type Post } from '@/types/database';
import { PageHeader, Card, Table, CellEllipsis, Badge, ActionButton, Button, Empty } from '@/components/ui';
import NoticeForm from './NoticeForm';

export default function NoticesClient({ notices: initialNotices }: { notices: (Post & { user?: { nickname: string } | null })[] }) {
  const [notices, setNotices] = useState(initialNotices);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (postId: string) => {
    if (!confirm('공지를 삭제하시겠어요?')) return;
    const res = await fetch('/api/notices', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      setNotices(notices.filter(n => n.id !== postId));
    }
  };

  const handleCreated = (newNotice: Post) => {
    setNotices([newNotice, ...notices]);
    setShowForm(false);
  };

  return (
    <>
      <PageHeader title="공지 관리">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> 공지 작성
        </Button>
      </PageHeader>

      {showForm && (
        <Card>
          <NoticeForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Card>
      )}

      <Card>
        {notices.length === 0 ? (
          <Empty>등록된 공지가 없어요</Empty>
        ) : (
          <Table heads={['게시판', '제목', '작성일', '관리']}>
            {notices.map(n => {
              const config = BOARD_CONFIG[n.board_type as BoardType];
              return (
                <tr key={n.id}>
                  <td><Badge variant="info">{config?.label || n.board_type}</Badge></td>
                  <CellEllipsis>{n.title}</CellEllipsis>
                  <td>{timeAgo(n.created_at)}</td>
                  <td>
                    <ActionButton variant="danger" onClick={() => handleDelete(n.id)}>
                      <Trash2 size={13} /> 삭제
                    </ActionButton>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </>
  );
}
