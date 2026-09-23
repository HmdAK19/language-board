import { Button } from '@/shared';

import type { LanguageDefinition } from '../types';
import styles from './LanguageCatalog.module.scss';

interface LanguageCatalogProps {
  languages: LanguageDefinition[];
  onMove: (from: number, to: number) => void;
  onRemove: (language: LanguageDefinition) => void;
}

export const LanguageCatalog = ({
  languages,
  onMove,
  onRemove,
}: LanguageCatalogProps) => {
  return (
    <section className={styles.section} aria-labelledby="language-list-title">
      <div className={styles.heading}>
        <h3 id="language-list-title">Available languages</h3>
        <span aria-label={`${languages.length} available languages`}>
          {languages.length}
        </span>
      </div>
      <ol className={styles.catalog}>
        {languages.map((language, index) => (
          <li key={language.code}>
            <span className={styles.languageDetails}>
              <b dir="auto">{language.label}</b> <small>{language.code}</small>
            </span>
            <div className={styles.actions}>
              <Button
                variant="secondary"
                aria-label={`Move ${language.label} up`}
                disabled={index === 0}
                onClick={() => onMove(index, index - 1)}
              >
                ↑
              </Button>
              <Button
                variant="secondary"
                aria-label={`Move ${language.label} down`}
                disabled={index === languages.length - 1}
                onClick={() => onMove(index, index + 1)}
              >
                ↓
              </Button>
              <Button
                variant="secondary"
                aria-label={`Delete ${language.label}`}
                disabled={languages.length <= 1}
                onClick={() => onRemove(language)}
              >
                ×
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
