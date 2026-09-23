import type { ReactNode } from 'react';

interface PageHeadingProps {
  id: string;
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeading = ({
  id,
  title,
  eyebrow,
  actions,
  className = '',
}: PageHeadingProps) => {
  return (
    <header className={`page-heading ${className}`.trim()}>
      <div className="page-heading-copy">
        {eyebrow && <span className="page-eyebrow">{eyebrow}</span>}
        <h1 id={id}>{title}</h1>
      </div>
      {actions}
    </header>
  );
};
