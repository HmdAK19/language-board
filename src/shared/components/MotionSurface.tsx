import { useLayoutEffect, type ReactNode } from 'react';
import {
  AnimatePresence,
  m,
  useAnimationControls,
  useReducedMotion,
} from 'motion/react';

import styles from './MotionSurface.module.scss';

type MotionVariant = 'page' | 'content';

interface MotionSurfaceProps {
  children: ReactNode;
  motionKey: string;
  variant: MotionVariant;
  className?: string;
}

const classNames = (...values: Array<string | undefined>) =>
  values.filter(Boolean).join(' ');

const PageMotion = ({
  children,
  motionKey,
  className,
}: Omit<MotionSurfaceProps, 'variant'>) => (
  <AnimatePresence mode="wait" initial={false}>
    <m.div
      key={motionKey}
      className={classNames(styles.surface, styles.page, className)}
      initial={{ opacity: 0, y: 26, scale: 0.985, filter: 'blur(9px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -14, scale: 0.992, filter: 'blur(5px)' }}
      transition={{
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.3 },
      }}
    >
      <span className={styles.pageAccent} aria-hidden="true" />
      {children}
    </m.div>
  </AnimatePresence>
);

const ContentMotion = ({
  children,
  motionKey,
  className,
}: Omit<MotionSurfaceProps, 'variant'>) => {
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) {
      void controls.start({ opacity: [0.55, 1] }, { duration: 0.16 });
      return;
    }

    controls.set({ opacity: 0.2, y: 12, scale: 0.994, filter: 'blur(6px)' });
    void controls.start(
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
      { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
    );
  }, [controls, motionKey, reduceMotion]);

  return (
    <m.div
      className={classNames(styles.surface, styles.content, className)}
      animate={controls}
    >
      <AnimatePresence>
        {!reduceMotion && (
          <m.span
            key={motionKey}
            className={styles.languageSweep}
            aria-hidden="true"
            initial={{ x: '-115%', opacity: 0 }}
            animate={{ x: '115%', opacity: [0, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>
      {children}
    </m.div>
  );
};

export const MotionSurface = (props: MotionSurfaceProps) =>
  props.variant === 'page' ? (
    <PageMotion {...props} />
  ) : (
    <ContentMotion {...props} />
  );
