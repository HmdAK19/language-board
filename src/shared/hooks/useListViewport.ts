import { useLayoutEffect, useState, type RefObject } from 'react';

// Lists must scroll themselves or use the window, not a nested scroll parent.
export const useListViewport = (ref: RefObject<HTMLUListElement | null>) => {
  const [windowScroll, setWindowScroll] = useState(false);
  const [margin, setMargin] = useState(0);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const usesWindow = !/(auto|scroll)/.test(
        getComputedStyle(element).overflowY,
      );
      setWindowScroll(usesWindow);
      setMargin(
        usesWindow ? element.getBoundingClientRect().top + window.scrollY : 0,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.parentElement) observer.observe(element.parentElement);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);
  return { windowScroll, margin };
};
