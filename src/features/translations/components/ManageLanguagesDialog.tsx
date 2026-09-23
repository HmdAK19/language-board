import { Modal } from '@/shared';

import { normalizeLanguageCode } from '../domain';
import { useTranslations } from '../hooks';
import type { LanguageDefinition } from '../types';
import { AddLanguageForm } from './AddLanguageForm';
import { LanguageCatalog } from './LanguageCatalog';

export const ManageLanguagesDialog = ({ onClose }: { onClose: () => void }) => {
  const {
    data,
    language: activeLanguage,
    dispatch,
    setLanguage,
  } = useTranslations();

  const addLanguage = (language: LanguageDefinition) => {
    const code = normalizeLanguageCode(language.code) ?? language.code.trim();
    dispatch({
      type: 'addLanguage',
      language: {
        code,
        label: language.label,
        direction: language.direction,
      },
    });
    setLanguage(code);
    onClose();
  };

  const moveLanguage = (from: number, to: number) => {
    dispatch({ type: 'moveLanguage', from, to });
  };

  const removeLanguage = (language: LanguageDefinition) => {
    if (
      !window.confirm(
        `Delete ${language.label}? Its translations will also be removed.`,
      )
    )
      return;

    dispatch({ type: 'removeLanguage', code: language.code });

    if (activeLanguage === language.code) {
      setLanguage(
        data.languages.find(({ code }) => code !== language.code)?.code ??
          activeLanguage,
      );
    }
  };

  return (
    <Modal
      title="Manage languages"
      description="Add languages and arrange their order in the language selector."
      onClose={onClose}
    >
      <LanguageCatalog
        languages={data.languages}
        onMove={moveLanguage}
        onRemove={removeLanguage}
      />
      <AddLanguageForm data={data} onAdd={addLanguage} onCancel={onClose} />
    </Modal>
  );
};
