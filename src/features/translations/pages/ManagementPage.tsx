import { useState } from 'react';

import { PageHeading } from '@/shared';

import {
  AddKeywordDialog,
  KeywordList,
  LanguageSelect,
  ManagementActions,
  ManageLanguagesDialog,
  ManagementOverview,
} from '../components';
import { useTranslations } from '../hooks';
import styles from './ManagementPage.module.scss';

const ManagementPage = () => {
  const { data } = useTranslations();
  const [adding, setAdding] = useState(false);
  const [managingLanguages, setManagingLanguages] = useState(false);

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
        <KeywordList />
      </div>
      <ManagementActions
        onAddKeyword={() => setAdding(true)}
        onManageLanguages={() => setManagingLanguages(true)}
      />

      {adding && <AddKeywordDialog onClose={() => setAdding(false)} />}

      {managingLanguages && (
        <ManageLanguagesDialog onClose={() => setManagingLanguages(false)} />
      )}
    </section>
  );
};
export default ManagementPage;
