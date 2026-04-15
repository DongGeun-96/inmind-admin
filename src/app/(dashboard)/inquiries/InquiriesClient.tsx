'use client';

import { useState } from 'react';
import createDOMPurify from 'dompurify';

const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null;
import { Send } from 'lucide-react';
import { timeAgo, formatDate } from '@/lib/format';
import type { Inquiry } from '@/types/database';
import { PageHeader, Card, Badge, Button, Empty } from '@/components/ui';
import styles from './inquiries.module.css';

export default function InquiriesClient({ inquiries: initialInquiries }: { inquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReply = async (inquiryId: string) => {
    if (!replyText.trim()) return;
    const res = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inquiryId, reply: replyText.trim() }),
    });
    if (res.ok) {
      setInquiries(inquiries.map(i =>
        i.id === inquiryId
          ? { ...i, reply: replyText.trim(), status: 'answered' as const, replied_at: new Date().toISOString() }
          : i
      ));
      setReplyText('');
      setReplyingId(null);
    } else {
      alert('답변 등록에 실패했어요.');
    }
  };

  return (
    <>
      <PageHeader title="문의 관리" />
      <Card>
        {inquiries.length === 0 ? (
          <Empty>문의 내역이 없어요</Empty>
        ) : (
          <ul className={styles.list}>
            {inquiries.map(inq => (
              <li key={inq.id} className={styles.item}>
                <div className={styles.header}>
                  <div className={styles.meta}>
                    <Badge variant={inq.status === 'answered' ? 'success' : 'warning'}>
                      {inq.status === 'answered' ? '답변완료' : '대기중'}
                    </Badge>
                    <span className={styles.category}>{inq.category}</span>
                    <span className={styles.user}>{inq.user?.nickname || '-'} ({inq.user?.email || '-'})</span>
                  </div>
                  <span className={styles.date}>{timeAgo(inq.created_at)}</span>
                </div>
                <h3 className={styles.title}>{inq.title}</h3>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: DOMPurify?.sanitize(inq.content) ?? inq.content }} />

                {inq.reply && (
                  <div className={styles.reply}>
                    <span className={styles.replyLabel}>답변</span>
                    <p>{inq.reply}</p>
                    {inq.replied_at && <span className={styles.replyDate}>{formatDate(inq.replied_at)}</span>}
                  </div>
                )}

                {!inq.reply && replyingId !== inq.id && (
                  <button className={styles.replyBtn} onClick={() => setReplyingId(inq.id)}>
                    <Send size={13} /> 답변 작성
                  </button>
                )}

                {replyingId === inq.id && (
                  <div className={styles.replyForm}>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="답변을 입력하세요"
                      className={styles.textarea}
                      rows={4}
                    />
                    <div className={styles.replyActions}>
                      <Button variant="secondary" onClick={() => { setReplyingId(null); setReplyText(''); }}>취소</Button>
                      <Button onClick={() => handleReply(inq.id)} disabled={!replyText.trim()}>답변 등록</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
