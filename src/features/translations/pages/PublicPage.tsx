import { PageHeading } from '@/shared';

import { LanguageSelect, TranslationList } from '../components';
import styles from './PublicPage.module.scss';

const PublicPage = () => {
  return (
    <section className={styles.publicPage} aria-labelledby="page-title">
      <PageHeading
        id="page-title"
        eyebrow="Reference library"
        title="Word Translations"
        actions={<LanguageSelect />}
      />
      <TranslationList />
    </section>
  );
};
export default PublicPage;
