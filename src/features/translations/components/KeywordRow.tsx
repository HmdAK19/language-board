import { Draggable } from '@hello-pangea/dnd';

import { useTranslations } from '../hooks';
import { type Keyword, type Language } from '../types';
import styles from './KeywordRow.module.scss';

interface KeywordRowProps {
  item: Keyword;
  index: number;
  language: Language;
  onEdit: (value: string) => void;
}

export const KeywordRow = ({
  item,
  index,
  language,
  onEdit,
}: KeywordRowProps) => {
  const { data } = useTranslations();
  const value = item.translations[language] ?? '';
  const empty = !value.trim();

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      disableInteractiveElementBlocking
    >
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${styles.keywordRow} ${empty ? styles.isMissing : ''} ${snapshot.isDragging ? styles.isDragging : ''}`}
        >
          <button
            type="button"
            className={styles.dragHandle}
            {...provided.dragHandleProps}
            aria-label={`Reorder ${item.keyword}`}
            title="Drag to reorder, or press Space and use arrow keys"
          >
            ⠿
          </button>
          <label
            htmlFor={`translation-${item.id}`}
            className={styles.keywordName}
          >
            {item.keyword}
          </label>
          <input
            id={`translation-${item.id}`}
            aria-label={`${item.keyword} translation`}
            aria-description={empty ? 'No translation yet' : undefined}
            className={styles.translationInput}
            value={value}
            maxLength={500}
            placeholder="·····"
            lang={language}
            dir={
              data.languages.find((item) => item.code === language)?.direction
            }
            onChange={(event) => onEdit(event.target.value)}
          />
        </li>
      )}
    </Draggable>
  );
};
