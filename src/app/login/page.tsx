'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, IdCard, Lock, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { toKoreanError } from '@/lib/error-messages';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('email, role')
        .eq('username', username.trim())
        .single();

      if (queryError || !userData) {
        setError('관리자 계정 정보가 올바르지 않아요.');
        setLoading(false);
        return;
      }

      if (userData.role !== 'admin') {
        setError('관리자 권한이 없는 계정이에요.');
        setLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });

      if (authError) {
        setError(toKoreanError(authError.message));
        setLoading(false);
        return;
      }

      window.location.href = '/';
    } catch {
      setError('오류가 발생했어요. 다시 시도해주세요.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Shield size={28} />
          </div>
          <h1 className={styles.title}>관리자 로그인</h1>
          <p className={styles.subtitle}>인마인드 관리 페이지</p>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleLogin} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>아이디</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><IdCard size={18} /></span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="관리자 아이디"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><Lock size={18} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
