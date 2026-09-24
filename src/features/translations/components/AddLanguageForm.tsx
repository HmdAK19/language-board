import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { Button, TextField } from '@/shared';

import { createLanguageFormSchema, type LanguageFormValues } from '../schemas';
import type { Dataset, LanguageDefinition } from '../types';
import styles from './AddLanguageForm.module.scss';

interface AddLanguageFormProps {
  data: Dataset;
  onAdd: (language: LanguageDefinition) => void;
  onCancel: () => void;
}

export const AddLanguageForm = ({
  data,
  onAdd,
  onCancel,
}: AddLanguageFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormValues>({
    resolver: yupResolver(createLanguageFormSchema(data)),
    defaultValues: {
      code: '',
      label: '',
      direction: 'ltr',
    },
  });

  const submit = (values: LanguageFormValues) => {
    onAdd({
      code: values.code.trim(),
      label: values.label.trim(),
      direction: values.direction,
    });
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(submit)}>
      <fieldset>
        <legend>Add a language</legend>
        <TextField
          label="Language code"
          autoFocus
          maxLength={35}
          placeholder="e.g. de or pt-BR"
          {...register('code')}
          error={errors.code?.message}
        />
        <TextField
          label="Language name"
          maxLength={80}
          placeholder="e.g. Deutsch"
          {...register('label')}
          error={errors.label?.message}
        />
        <label htmlFor="language-direction">Text direction</label>
        <select
          id="language-direction"
          className={styles.select}
          {...register('direction')}
          aria-invalid={errors.direction ? true : undefined}
        >
          <option value="ltr">Left to right</option>
          <option value="rtl">Right to left</option>
        </select>
        {errors.direction?.message && (
          <p role="alert" className={styles.errorText}>
            {errors.direction.message}
          </p>
        )}
      </fieldset>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          Done
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Add language
        </Button>
      </div>
    </form>
  );
};
