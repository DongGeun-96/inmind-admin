import { ReactNode } from 'react';
import styles from './ui.module.css';

/* ── PageHeader ── */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {children}
    </div>
  );
}

/* ── Card ── */
export function Card({ children }: { children: ReactNode }) {
  return <div className={styles.card}>{children}</div>;
}

/* ── Table ── */
export function Table({ heads, children }: { heads: string[]; children: ReactNode }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>{heads.map(h => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function CellBold({ children }: { children: ReactNode }) {
  return <td className={styles.cellBold}>{children}</td>;
}

export function CellEllipsis({ children }: { children: ReactNode }) {
  return <td className={styles.cellEllipsis}>{children}</td>;
}

/* ── Badge ── */
type BadgeVariant = 'success' | 'danger' | 'warning' | 'info';
const badgeMap: Record<BadgeVariant, string> = {
  success: styles.badgeSuccess,
  danger: styles.badgeDanger,
  warning: styles.badgeWarning,
  info: styles.badgeInfo,
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return <span className={badgeMap[variant]}>{children}</span>;
}

/* ── ActionButton ── */
type ActionVariant = 'default' | 'danger' | 'success';
const actionMap: Record<ActionVariant, string> = {
  default: styles.actionBtn,
  danger: styles.actionBtnDanger,
  success: styles.actionBtnSuccess,
};

export function ActionGroup({ children }: { children: ReactNode }) {
  return <div className={styles.actionGroup}>{children}</div>;
}

export function ActionButton({
  variant = 'default',
  onClick,
  disabled,
  children,
}: {
  variant?: ActionVariant;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button className={actionMap[variant]} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/* ── Button ── */
export function Button({
  variant = 'primary',
  disabled,
  onClick,
  children,
}: {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      className={variant === 'primary' ? styles.btnPrimary : styles.btnSecondary}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* ── Empty ── */
export function Empty({ children }: { children: ReactNode }) {
  return <p className={styles.empty}>{children}</p>;
}
