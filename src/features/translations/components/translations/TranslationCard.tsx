import { memo } from 'react';
import { type Language, type LanguageDefinition } from '../../types';
import styles from './TranslationCard.module.scss';

interface TranslationCardProps {
  keyword: string;
  value: string;
  language: Language;
  direction: LanguageDefinition['direction'] | undefined;
}

export const TranslationCard = memo(
  ({ keyword, value, language, direction }: TranslationCardProps) => {
    return (
      <li className={styles.wordCard}>
        <article>
          <h2>{keyword.toLocaleLowerCase()}</h2>

          {value.trim() ? (
            <p lang={language} dir={direction}>
              {value}
            </p>
          ) : (
            <p className={styles.missingTranslation}>No translation yet</p>
          )}
        </article>
      </li>
    );
  },
);

TranslationCard.displayName = 'TranslationCard';
