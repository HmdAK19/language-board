import { useTranslations } from '../hooks';
import { TranslationCard } from './TranslationCard';
import styles from './TranslationList.module.scss';

export const TranslationList = () => {
  const { data, language } = useTranslations();

  return (
    <>
      <ul className={styles.list}>
        {data.keywords.order.map((id) => (
          <TranslationCard
            key={id}
            keyword={data.keywords.byId[id].keyword}
            value={data.keywords.byId[id].translations[language] ?? ''}
            language={language}
          />
        ))}
      </ul>

      {!data.keywords.order.length && (
        <p className="empty-state">No keywords have been added yet.</p>
      )}
    </>
  );
};
