'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, AlertTriangle,
  Headphones, LogOut, Shield, Megaphone, UserPlus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/users', label: '회원 관리', icon: Users },
  { href: '/posts', label: '게시글 관리', icon: FileText },
  { href: '/notices', label: '공지 관리', icon: Megaphone },
  { href: '/reports', label: '신고 관리', icon: AlertTriangle },
  { href: '/inquiries', label: '문의 관리', icon: Headphones },
  { href: '/expert-inquiries', label: '전문가 등록 문의', icon: UserPlus },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Shield size={22} className={styles.logoIcon} />
        <div>
          <div className={styles.logoTitle}>인마인드</div>
          <div className={styles.logoSub}>관리자</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>
    </aside>
  );
}
