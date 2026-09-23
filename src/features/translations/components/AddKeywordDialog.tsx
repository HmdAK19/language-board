import { Modal } from '@/shared';

import { getKeywordValidationError } from '../domain';
import { useTranslations } from '../hooks';
import { KeywordForm, type KeywordFormValues } from './KeywordForm';

export const AddKeywordDialog = ({ onClose }: { onClose: () => void }) => {
  const { data, dispatch } = useTranslations();

  const add = (values: KeywordFormValues) => {
    dispatch({
      type: 'add',
      id: crypto.randomUUID(),
      keyword: values.keyword,
      translations: values.translations,
    });
    onClose();
  };

  return (
    <Modal
      title="Add a keyword"
      description="Start with one translation. Add other languages whenever you’re ready."
      onClose={onClose}
    >
      <KeywordForm
        languages={data.languages}
        data={data}
        validateKeyword={(keyword) => getKeywordValidationError(keyword, data)}
        onSubmit={add}
        onCancel={onClose}
      />
    </Modal>
  );
};
