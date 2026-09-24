import { useTranslations } from '../../hooks';
import { type Language } from '../../types';
import styles from './TranslationCard.module.scss';

interface TranslationCardProps {
  keyword: string;
  value: string;
  language: Language;
}

export const TranslationCard = ({
  keyword,
  value,
  language,
}: TranslationCardProps) => {
  const { data } = useTranslations();

  return (
    <li className={styles.wordCard}>
      <article>
        <h2>{keyword.toLocaleLowerCase()}</h2>

        {value.trim() ? (
          <p
            lang={language}
            dir={
              data.languages.find((item) => item.code === language)?.direction
            }
          >
            {value}
          </p>
        ) : (
          <p className={styles.missingTranslation}>No translation yet</p>
        )}
      </article>
    </li>
  );
};
