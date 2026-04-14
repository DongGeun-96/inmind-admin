'use client';

import { useState } from 'react';
import { BOARD_CONFIG, CATEGORIES, type BoardType, type Post } from '@/types/database';
import { Button } from '@/components/ui';
import styles from './notices.module.css';

interface Props {
  onCreated: (notice: Post) => void;
  onCancel: () => void;
}

export default function NoticeForm({ onCreated, onCancel }: Props) {
  const [boardType, setBoardType] = useState<BoardType>('emotion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);

    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        boardType,
        title: title.trim(),
        content: content.trim(),
      }),
    });

    if (res.ok) {
      const { notice } = await res.json();
      onCreated(notice);
      setTitle('');
      setContent('');
    } else {
      alert('공지 등록에 실패했어요.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>게시판</label>
        <select
          value={boardType}
          onChange={e => setBoardType(e.target.value as BoardType)}
          className={styles.select}
        >
          {CATEGORIES.map(cat => (
            <optgroup key={cat.name} label={cat.name}>
              {cat.boards.map(board => (
                <option key={board} value={board}>
                  {BOARD_CONFIG[board].label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>제목</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="공지 제목을 입력하세요"
          className={styles.input}
          maxLength={100}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>내용</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="공지 내용을 입력하세요"
          className={styles.textarea}
          rows={6}
          required
        />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>취소</Button>
        <Button disabled={loading || !title.trim() || !content.trim()}>
          {loading ? '등록 중...' : '공지 등록'}
        </Button>
      </div>
    </form>
  );
}
