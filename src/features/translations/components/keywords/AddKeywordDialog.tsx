import { Modal } from '@/shared';

import { getKeywordValidationError } from '../../domain';
import { useTranslations } from '../../hooks';
import { KeywordForm, type KeywordFormValues } from './KeywordForm';
import type { Keyword } from '../../types';

export const AddKeywordDialog = ({
  onClose,
  keyword,
}: {
  onClose: () => void;
  keyword?: Keyword;
}) => {
  const { data, dispatch } = useTranslations();

  const save = (values: KeywordFormValues) => {
    dispatch(
      keyword
        ? {
            type: 'updateKeyword',
            id: keyword.id,
            keyword: values.keyword,
            translations: values.translations,
          }
        : {
            type: 'add',
            id: crypto.randomUUID(),
            keyword: values.keyword,
            translations: values.translations,
          },
    );
    onClose();
  };

  return (
    <Modal
      title={keyword ? `Edit keyword · ${keyword.keyword}` : 'Add a keyword'}
      description={
        keyword
          ? 'Edit the keyword and all of its translations.'
          : 'Start with one translation. Add other languages whenever you’re ready.'
      }
      onClose={onClose}
    >
      <KeywordForm
        languages={data.languages}
        data={data}
        validateKeyword={(value) =>
          getKeywordValidationError(value, data, keyword?.id)
        }
        initialValues={
          keyword
            ? {
                keyword: keyword.keyword,
                translations: Object.fromEntries(
                  data.languages.map(({ code }) => [
                    code,
                    keyword.translations[code] ?? '',
                  ]),
                ),
              }
            : undefined
        }
        submitLabel={keyword ? 'Save keyword' : 'Add keyword'}
        onSubmit={save}
        onCancel={onClose}
      />
    </Modal>
  );
};
