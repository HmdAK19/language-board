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
  const [editingKeywordId, setEditingKeywordId] = useState<string | null>(null);
  const editingKeyword = editingKeywordId
    ? data.keywords.byId[editingKeywordId]
    : undefined;

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
        <KeywordList onEditTranslations={setEditingKeywordId} />
      </div>
      <ManagementActions
        onAddKeyword={() => setAdding(true)}
        onManageLanguages={() => setManagingLanguages(true)}
      />

      {adding && <AddKeywordDialog onClose={() => setAdding(false)} />}

      {managingLanguages && (
        <ManageLanguagesDialog onClose={() => setManagingLanguages(false)} />
      )}
      {editingKeyword && (
        <AddKeywordDialog
          keyword={editingKeyword}
          onClose={() => setEditingKeywordId(null)}
        />
      )}
    </section>
  );
};
export default ManagementPage;
