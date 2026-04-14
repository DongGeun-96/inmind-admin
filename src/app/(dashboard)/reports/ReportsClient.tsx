'use client';

import { useState } from 'react';
import { Trash2, XCircle } from 'lucide-react';
import { timeAgo } from '@/lib/format';
import type { Report } from '@/types/database';
import { PageHeader, Card, Table, CellEllipsis, Badge, ActionGroup, ActionButton, Empty } from '@/components/ui';

export default function ReportsClient({ reports: initialReports }: { reports: Report[] }) {
  const [reports, setReports] = useState(initialReports);

  const handleResolve = async (report: Report) => {
    if (!confirm(
      `신고된 ${report.target_type === 'post' ? '게시글' : '댓글'}을 삭제하고 작성자를 차단하시겠어요?`
    )) return;

    const res = await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId: report.id,
        action: 'resolve',
        targetType: report.target_type,
        targetId: report.target_id,
        targetUserId: report.target_user_id,
      }),
    });
    if (res.ok) {
      const { banned } = await res.json();
      setReports(reports.map(r =>
        r.id === report.id
          ? { ...r, is_handled: true, action: banned ? 'resolved' as const : 'resolved_delete_only' as const }
          : r
      ));
    } else {
      alert('처리에 실패했어요.');
    }
  };

  const handleDismiss = async (reportId: string) => {
    if (!confirm('이 신고를 반려하시겠어요?')) return;

    const res = await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, action: 'dismiss' }),
    });
    if (res.ok) {
      setReports(reports.map(r =>
        r.id === reportId ? { ...r, is_handled: true, action: 'dismissed' as const } : r
      ));
    }
  };

  return (
    <>
      <PageHeader title="신고 관리" />
      <Card>
        {reports.length === 0 ? (
          <Empty>신고 내역이 없어요</Empty>
        ) : (
          <Table heads={['유형', '신고 대상', '작성자', '사유', '신고일', '상태', '관리']}>
            {reports.map(r => (
              <tr key={r.id}>
                <td><Badge variant="info">{r.target_type === 'post' ? '게시글' : '댓글'}</Badge></td>
                <CellEllipsis>{r.target_content || '(삭제됨)'}</CellEllipsis>
                <td>{r.target_user_nickname || '-'}</td>
                <CellEllipsis>{r.reason}</CellEllipsis>
                <td>{timeAgo(r.created_at)}</td>
                <td>
                  {!r.is_handled ? (
                    <Badge variant="danger">미처리</Badge>
                  ) : r.action === 'dismissed' ? (
                    <Badge variant="warning">반려</Badge>
                  ) : r.action === 'resolved_delete_only' ? (
                    <Badge variant="info">삭제만</Badge>
                  ) : (
                    <Badge variant="success">삭제+차단</Badge>
                  )}
                </td>
                <td>
                  {!r.is_handled && (
                    <ActionGroup>
                      <ActionButton variant="danger" onClick={() => handleResolve(r)}>
                        <Trash2 size={13} /> 삭제+차단
                      </ActionButton>
                      <ActionButton variant="default" onClick={() => handleDismiss(r.id)}>
                        <XCircle size={13} /> 반려
                      </ActionButton>
                    </ActionGroup>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
