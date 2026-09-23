import { SkeletonBlock, SkeletonStatus } from './SkeletonBase';
import styles from './Skeleton.module.scss';

const METRIC_COUNT = 3;
const ROW_COUNT = 6;

export const ManagementPageSkeleton = () => (
  <SkeletonStatus label="Loading translation management">
    <aside className={styles.adminNav}>
      <SkeletonBlock className={styles.adminBrand} />
      <SkeletonBlock className={styles.adminContext} />
      <SkeletonBlock className={styles.adminAction} />
    </aside>
    <main className={styles.adminMain}>
      <div className={styles.heading}>
        <SkeletonBlock className={styles.eyebrow} />
        <SkeletonBlock className={styles.adminTitle} />
      </div>
      <section className={styles.metrics}>
        {Array.from({ length: METRIC_COUNT }, (_, index) => (
          <SkeletonBlock className={styles.metric} key={index} />
        ))}
      </section>
      <section className={styles.managementPanel}>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <div className={styles.row} key={index}>
            <SkeletonBlock className={styles.rowLabel} />
            <SkeletonBlock className={styles.rowInput} />
          </div>
        ))}
      </section>
    </main>
  </SkeletonStatus>
);
