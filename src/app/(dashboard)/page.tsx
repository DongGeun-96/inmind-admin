import { Users, FileText, MessageCircle, AlertTriangle, Headphones } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase-admin';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createAdminClient();

  const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: commentCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
  const { count: reportCount } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('is_handled', false);
  const { count: inquiryCount } = await supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending');

  const stats = [
    { label: '전체 회원', value: userCount || 0, icon: Users, color: 'statIconBlue' },
    { label: '전체 게시글', value: postCount || 0, icon: FileText, color: 'statIconGreen' },
    { label: '전체 댓글', value: commentCount || 0, icon: MessageCircle, color: 'statIconBlue' },
    { label: '미처리 신고', value: reportCount || 0, icon: AlertTriangle, color: 'statIconRed' },
    { label: '미답변 문의', value: inquiryCount || 0, icon: Headphones, color: 'statIconYellow' },
  ];

  return (
    <>
      <h1 className={styles.pageTitle}>대시보드</h1>
      <div className={styles.grid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles[stat.color as keyof typeof styles]}>
                <Icon size={20} />
              </div>
              <div>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
