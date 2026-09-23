import { useCallback, useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};

const subscribeDisabled = () => () => {};
const getServerSnapshot = () => false;

export const usePageScrolled = (enabled = true) => {
  const getSnapshot = useCallback(
    () => enabled && window.scrollY > 0,
    [enabled],
  );

  return useSyncExternalStore(
    enabled ? subscribe : subscribeDisabled,
    getSnapshot,
    getServerSnapshot,
  );
};
