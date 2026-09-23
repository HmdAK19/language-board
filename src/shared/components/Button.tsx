import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  leadingIcon?: ReactNode;
}

export const Button = ({
  variant = 'primary',
  type = 'button',
  className = '',
  leadingIcon,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      className={`${variant}-button ${className}`.trim()}
    >
      {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
      {children}
    </button>
  );
};
