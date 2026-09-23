import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { useTranslations } from '../hooks';
import { KeywordRow } from './KeywordRow';
import styles from './KeywordList.module.scss';

export const KeywordList = () => {
  const { data, language, dispatch } = useTranslations();

  return (
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        if (destination)
          dispatch({
            type: 'move',
            from: source.index,
            to: destination.index,
          });
      }}
    >
      <Droppable droppableId="keywords">
        {(provided) => (
          <ul
            className={styles.list}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.keywords.order.map((id, index) => (
              <KeywordRow
                key={id}
                item={data.keywords.byId[id]}
                index={index}
                language={language}
                onEdit={(value) =>
                  dispatch({
                    type: 'edit',
                    id,
                    language,
                    value,
                  })
                }
              />
            ))}

            {provided.placeholder}

            {!data.keywords.order.length && (
              <li className="empty-state">
                No keywords yet. Add your first keyword below.
              </li>
            )}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};
