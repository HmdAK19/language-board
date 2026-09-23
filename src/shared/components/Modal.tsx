import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './Modal.module.scss';

export const Modal = ({
  children,
  title,
  description,
  onClose,
}: {
  children: ReactNode;
  title: string;
  description?: string;
  onClose: () => void;
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    // React's autofocus runs before a native dialog is opened. Restore the
    // requested initial target after showModal, including StrictMode remounts.
    dialog?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  return (
    <dialog
      className={styles.modal}
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <header className={styles.header}>
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
      </header>
      <div className={styles.content}>
        {description && (
          <p id={descriptionId} className={styles.muted}>
            {description}
          </p>
        )}
        {children}
      </div>
    </dialog>
  );
};
