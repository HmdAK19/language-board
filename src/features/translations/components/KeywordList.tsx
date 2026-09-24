import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';

import { useTranslations } from '../hooks';
import { VirtualList } from '@/shared';
import { KeywordRow, KeywordRowContent } from './KeywordRow';
import { useKeywordFilters } from '../hooks/useKeywordFilters';
import { KeywordFilters } from './KeywordFilters';
import styles from './KeywordList.module.scss';

export const KeywordList = ({
  onEditTranslations,
  onDelete,
}: {
  onEditTranslations: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { data, language, dispatch } = useTranslations();
  const filters = useKeywordFilters();
  const direction = data.languages.find(
    (item) => item.code === language,
  )?.direction;
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <>
      <KeywordFilters filters={filters} management />
      <DragDropContext
        onBeforeCapture={({ draggableId }) => setDraggedId(draggableId)}
        onDragEnd={({ source, destination }) => {
          setDraggedId(null);

          if (
            !filters.active &&
            destination &&
            destination.index !== source.index
          )
            dispatch({
              type: 'move',
              from: source.index,
              to: destination.index,
            });
        }}
      >
        <Droppable
          droppableId="keywords"
          mode="virtual"
          renderClone={(provided, snapshot, rubric) => (
            <KeywordRowContent
              item={data.keywords.byId[rubric.draggableId]}
              language={language}
              direction={direction}
              provided={provided}
              snapshot={snapshot}
              onEdit={() => {}}
              onEditTranslations={() => {}}
              onDelete={() => {}}
            />
          )}
        >
          {(provided) => (
            <VirtualList
              key={JSON.stringify([filters.query, filters.status, language])}
              className={styles.list}
              listRef={provided.innerRef}
              {...provided.droppableProps}
              aria-label="Keywords"
              retainedItemKey={draggedId}
              items={filters.ids}
              getKey={(id) => id}
              estimateSize={86}
              emptyState={
                filters.active
                  ? 'No matching keywords. Try another search or clear filters.'
                  : 'No keywords yet. Add your first keyword below.'
              }
              renderItem={(id, index) => (
                <KeywordRow
                  item={data.keywords.byId[id]}
                  index={index}
                  isDragDisabled={filters.active}
                  language={language}
                  direction={direction}
                  onEdit={(value) =>
                    dispatch({ type: 'edit', id, language, value })
                  }
                  onEditTranslations={() => onEditTranslations(id)}
                  onDelete={() => onDelete(id)}
                />
              )}
            />
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
