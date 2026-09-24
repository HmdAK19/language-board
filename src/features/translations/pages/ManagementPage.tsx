import { PageHeading } from '@/shared';

import {
  KeywordList,
  LanguageSelect,
  ManagementActions,
  ManagementOverview,
} from '../components';
import { ManagementDialogs } from './ManagementDialogs';
import { useManagementPageActions } from '../hooks';
import styles from './ManagementPage.module.scss';

const ManagementPage = () => {
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
      <div className={styles.managementCard}>
        <KeywordList
          onEditTranslations={openEditKeyword}
          onDelete={deleteKeyword}
        />
      </div>
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
