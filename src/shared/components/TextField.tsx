import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';

interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  label: ReactNode;
  error?: string;
}

export const TextField = ({
  id,
  label,
  error,
  autoFocus,
  'aria-describedby': describedBy,
  ...props
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const description =
    [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') ||
    undefined;

  return (
    <>
      <label htmlFor={inputId}>{label}</label>
      <input
        {...props}
        autoFocus={autoFocus}
        data-autofocus={autoFocus || undefined}
        id={inputId}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={description}
      />

      {error && (
        <p id={errorId} role="alert" className="error-text">
          {error}
        </p>
      )}
    </>
  );
};
