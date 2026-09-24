import { MotionSurface, PageHeading } from '@/shared';
import { useTranslations } from '../hooks';

import { LanguageSelect } from '../components/languages/LanguageSelect';
import { TranslationList } from '../components/translations/TranslationList';
import styles from './PublicPage.module.scss';

const PublicPage = () => {
  const { language } = useTranslations();

  return (
    <section className={styles.publicPage} aria-labelledby="page-title">
      <PageHeading
        id="page-title"
        eyebrow="Reference library"
        title="Word Translations"
        actions={<LanguageSelect />}
      />
      <MotionSurface motionKey={language} variant="content">
        <TranslationList />
      </MotionSurface>
    </section>
  );
};
export default PublicPage;
