import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';

import { type Keyword, type Language, type LanguageDefinition } from '../types';
import { ActionIcon } from './ActionIcon';
import styles from './KeywordRow.module.scss';

interface KeywordRowProps {
  item: Keyword;
  index: number;
  isDragDisabled?: boolean;
  language: Language;
  direction: LanguageDefinition['direction'] | undefined;
  onEdit: (value: string) => void;
  onEditTranslations: () => void;
  onDelete: () => void;
}

export const KeywordRowContent = ({
  item,
  language,
  direction,
  onEdit,
  onEditTranslations,
  onDelete,
  provided,
  snapshot,
  isDragDisabled,
}: Omit<KeywordRowProps, 'index'> & {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}) => {
  const value = item.translations[language] ?? '';
  const empty = !value.trim();

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`${styles.keywordRow} ${empty ? styles.isMissing : ''} ${snapshot.isDragging ? styles.isDragging : ''}`}
    >
      <button
        type="button"
        className={styles.dragHandle}
        {...provided.dragHandleProps}
        aria-label={`Reorder ${item.keyword}`}
        disabled={isDragDisabled}
        title="Drag to reorder, or press Space and use arrow keys"
      >
        <ActionIcon name="grip" />
      </button>
      <label htmlFor={`translation-${item.id}`} className={styles.keywordName}>
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
        dir={direction}
        onChange={(event) => onEdit(event.target.value)}
      />
      <button
        type="button"
        className={styles.editLanguages}
        onClick={onEditTranslations}
        aria-label={`Edit all translations for ${item.keyword}`}
        title={`Edit all translations for ${item.keyword}`}
      >
        <ActionIcon name="pencil" />
      </button>
      <button
        type="button"
        className={styles.deleteKeyword}
        onClick={onDelete}
        aria-label={`Delete ${item.keyword}`}
        title={`Delete ${item.keyword}`}
      >
        <ActionIcon name="trash" />
      </button>
    </div>
  );
};

export const KeywordRow = (props: KeywordRowProps) => (
  <Draggable
    draggableId={props.item.id}
    index={props.index}
    isDragDisabled={props.isDragDisabled}
    disableInteractiveElementBlocking
  >
    {(provided, snapshot) => (
      <KeywordRowContent {...props} provided={provided} snapshot={snapshot} />
    )}
  </Draggable>
);
