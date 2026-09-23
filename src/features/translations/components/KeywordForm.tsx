import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button, TextField } from '@/shared';

import {
  createKeywordFormSchema,
  type KeywordFormValues,
} from '../schemas';
import type { Dataset, LanguageDefinition } from '../types';
export type { KeywordFormValues } from '../schemas';
import styles from './KeywordForm.module.scss';

interface KeywordFormProps {
  languages: LanguageDefinition[];
  data: Dataset;
  validateKeyword: (keyword: string) => string | null;
  onSubmit: (values: KeywordFormValues) => void;
  onCancel: () => void;
}

export const KeywordForm = ({
  languages,
  data,
  validateKeyword,
  onSubmit,
  onCancel,
}: KeywordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<KeywordFormValues>({
    resolver: yupResolver(createKeywordFormSchema(validateKeyword, data)),
    defaultValues: {
      keyword: '',
      translations: Object.fromEntries(languages.map(({ code }) => [code, ''])),
    },
  });

  return (
    <form
      className={styles.keywordForm}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <section
        className={styles.keywordSection}
        aria-labelledby="keyword-details-title"
      >
        <h3 id="keyword-details-title">Keyword details</h3>
        <TextField
          label="Keyword"
          autoFocus
          maxLength={80}
          {...register('keyword')}
          placeholder="e.g. Welcome"
          error={errors.keyword?.message}
        />
      </section>
      <fieldset
        className={styles.translationsScroll}
        aria-label="Translations by language"
      >
        <legend>Translations</legend>

        {languages.map((item) => (
          <TextField
            key={item.code}
            label={`Translation · ${item.label}`}
            lang={item.code}
            dir={item.direction}
            maxLength={500}
            {...register(`translations.${item.code}`)}
            error={errors.translations?.message as string | undefined}
          />
        ))}
      </fieldset>
      <div className={styles.dialogActions}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Add keyword
        </Button>
      </div>
    </form>
  );
};
