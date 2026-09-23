import type { ReactNode } from 'react';
import styles from './Skeleton.module.scss';

export const SkeletonBlock = ({ className }: { className: string }) => (
  <span className={`${styles.block} ${className}`} aria-hidden="true" />
);

export const SkeletonStatus = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div
    className={styles.loadingShell}
    role="status"
    aria-live="polite"
    aria-label={label}
  >
    <span className={styles.srOnly}>{label}…</span>
    {children}
  </div>
);
