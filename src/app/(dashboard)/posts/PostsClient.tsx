'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import { BOARD_CONFIG, type BoardType, type Post } from '@/types/database';
import { PageHeader, Card, Table, CellEllipsis, Badge, ActionButton, Empty } from '@/components/ui';

export default function PostsClient({ posts: initialPosts }: { posts: (Post & { user?: { nickname: string } | null })[] }) {
  const [posts, setPosts] = useState(initialPosts);

  const handleDelete = async (postId: string) => {
    if (!confirm('게시글을 삭제하시겠어요?')) return;
    const res = await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  return (
    <>
      <PageHeader title="게시글 관리" />
      <Card>
        <Table heads={['게시판', '제목', '작성자', '조회', '작성일', '관리']}>
          {posts.map(p => {
            const config = BOARD_CONFIG[p.board_type as BoardType];
            return (
              <tr key={p.id}>
                <td><Badge variant="info">{config?.label || p.board_type}</Badge></td>
                <CellEllipsis>{p.title}</CellEllipsis>
                <td>{p.is_anonymous ? '익명' : p.user?.nickname || '-'}</td>
                <td>{p.view_count}</td>
                <td>{timeAgo(p.created_at)}</td>
                <td>
                  <ActionButton variant="danger" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={13} /> 삭제
                  </ActionButton>
                </td>
              </tr>
            );
          })}
          {posts.length === 0 && (
            <tr><td colSpan={6}><Empty>게시글이 없어요</Empty></td></tr>
          )}
        </Table>
      </Card>
    </>
  );
}
