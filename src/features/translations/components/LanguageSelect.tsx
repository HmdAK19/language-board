import { useTranslations } from '../hooks';
import styles from './LanguageSelect.module.scss';

export const LanguageSelect = () => {
  const { data, language, setLanguage } = useTranslations();

  return (
    <span className={styles.control}>
      <select
        aria-label="Translation language"
        className={styles.languageSelect}
        value={language}
        onChange={(event) => {
          const selected = data.languages.find(
            (item) => item.code === event.target.value,
          );
          if (selected) setLanguage(selected.code);
        }}
      >
        {data.languages.map((item) => (
          <option key={item.code} value={item.code} lang={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </span>
  );
};
