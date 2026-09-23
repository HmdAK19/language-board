import { useLayoutEffect, useState, type RefObject } from 'react';

export const useTranslationColumns = (
  container: RefObject<HTMLDivElement | null>,
) => {
  const [columns, setColumns] = useState(1);

  useLayoutEffect(() => {
    const element = container.current;
    if (!element) return;

    const update = () =>
      setColumns(
        Math.max(
          1,
          Math.floor(
            Number(getComputedStyle(element).getPropertyValue('--columns')) ||
              1,
          ),
        ),
      );
    update();

    const observer = new ResizeObserver(update);
    observer.observe(element);

    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [container]);

  return columns;
};
