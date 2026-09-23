import { SkeletonBlock, SkeletonStatus } from './SkeletonBase';
import styles from './Skeleton.module.scss';

const CARD_COUNT = 6;

export const PublicPageSkeleton = () => (
  <SkeletonStatus label="Loading translations">
    <header className={styles.nav}>
      <SkeletonBlock className={styles.brand} />
      <SkeletonBlock className={styles.navAction} />
    </header>
    <main className={styles.publicMain}>
      <div className={styles.heading}>
        <SkeletonBlock className={styles.eyebrow} />
        <SkeletonBlock className={styles.title} />
      </div>
      <section className={styles.publicPanel}>
        {Array.from({ length: CARD_COUNT }, (_, index) => (
          <article className={styles.publicCard} key={index}>
            <SkeletonBlock className={styles.cardTitle} />
            <SkeletonBlock className={styles.cardText} />
            <SkeletonBlock className={styles.cardTextShort} />
          </article>
        ))}
      </section>
    </main>
  </SkeletonStatus>
);
