import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';

import { useTranslations } from '../hooks';
import { VirtualList } from '@/shared';
import { KeywordRow, KeywordRowContent } from './KeywordRow';
import styles from './KeywordList.module.scss';

export const KeywordList = () => {
  const { data, language, dispatch } = useTranslations();
  const direction = data.languages.find(
    (item) => item.code === language,
  )?.direction;
  const [draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <DragDropContext
      onBeforeCapture={({ draggableId }) => setDraggedId(draggableId)}
      onDragEnd={({ source, destination }) => {
        setDraggedId(null);
        if (destination && destination.index !== source.index)
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
          />
        )}
      >
        {(provided) => (
          <VirtualList
            className={styles.list}
            listRef={provided.innerRef}
            {...provided.droppableProps}
            aria-label="Keywords"
            retainedItemKey={draggedId}
            items={data.keywords.order}
            getKey={(id) => id}
            estimateSize={86}
            emptyState="No keywords yet. Add your first keyword below."
            renderItem={(id, index) => (
              <KeywordRow
                item={data.keywords.byId[id]}
                index={index}
                language={language}
                direction={direction}
                onEdit={(value) =>
                  dispatch({ type: 'edit', id, language, value })
                }
              />
            )}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
};
