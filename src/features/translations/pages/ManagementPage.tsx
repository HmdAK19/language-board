import { MotionSurface, PageHeading } from '@/shared';

import { KeywordList } from '../components/keywords/KeywordList';
import { LanguageSelect } from '../components/languages/LanguageSelect';
import { ManagementActions } from '../components/management/ManagementActions';
import { ManagementOverview } from '../components/management/ManagementOverview';
import { ManagementDialogs } from './ManagementDialogs';
import { useManagementPageActions, useTranslations } from '../hooks';
import styles from './ManagementPage.module.scss';

const ManagementPage = () => {
  const { language } = useTranslations();
  const {
    data,
    dialog,
    closeDialog,
    openAddKeyword,
    openManageLanguages,
    openEditKeyword,
    openDatasetTransfer,
    deleteKeyword,
    clearKeywords,
  } = useManagementPageActions();

  return (
    <section className={styles.managementPage} aria-labelledby="page-title">
      <PageHeading
        id="page-title"
        eyebrow="Workspace"
        title="Translation Management"
        actions={<LanguageSelect />}
        className={styles.heading}
      />
      <ManagementOverview data={data} />
      <MotionSurface
        motionKey={language}
        variant="content"
        className={styles.contentTransition}
      >
        <div className={styles.managementCard}>
          <KeywordList
            onEditTranslations={openEditKeyword}
            onDelete={deleteKeyword}
          />
        </div>
      </MotionSurface>
      <ManagementActions
        onAddKeyword={openAddKeyword}
        onManageLanguages={openManageLanguages}
        onDatasetTransfer={openDatasetTransfer}
        onClearKeywords={clearKeywords}
        hasKeywords={data.order.length > 0}
        hasLanguages={data.languages.length > 0}
      />
      <ManagementDialogs dialog={dialog} data={data} onClose={closeDialog} />
    </section>
  );
};
export default ManagementPage;
