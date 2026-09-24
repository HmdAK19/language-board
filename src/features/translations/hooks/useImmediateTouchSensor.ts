import { useEffect } from 'react';
import type { FluidDragActions, Sensor } from '@hello-pangea/dnd';

export const useImmediateTouchSensor: Sensor = (api) => {
  useEffect(() => {
    let drag: FluidDragActions | null = null;

    const stopListening = () => {
      window.removeEventListener('touchmove', onTouchMove, true);
      window.removeEventListener('touchend', onTouchEnd, true);
      window.removeEventListener('touchcancel', onTouchCancel, true);
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerup', onTouchEnd, true);
      window.removeEventListener('pointercancel', onTouchCancel, true);
      drag = null;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!drag || event.touches.length !== 1) return;

      event.preventDefault();
      const touch = event.touches[0];
      drag.move({ x: touch.clientX, y: touch.clientY });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerType !== 'touch') return;

      event.preventDefault();
      drag.move({ x: event.clientX, y: event.clientY });
    };

    const onTouchEnd = (event: Event) => {
      if (!drag) return;

      event.preventDefault();
      const activeDrag = drag;
      stopListening();
      activeDrag.drop({ shouldBlockNextClick: true });
    };

    const onTouchCancel = () => {
      if (!drag) return;

      const activeDrag = drag;
      stopListening();
      activeDrag.cancel({ shouldBlockNextClick: true });
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.defaultPrevented || event.touches.length !== 1) return;

      const draggableId = api.findClosestDraggableId(event);
      if (!draggableId) return;

      const pendingDrag = api.tryGetLock(draggableId, stopListening, {
        sourceEvent: event,
      });
      if (!pendingDrag) return;

      event.preventDefault();
      const touch = event.touches[0];
      drag = pendingDrag.fluidLift({ x: touch.clientX, y: touch.clientY });

      window.addEventListener('touchmove', onTouchMove, {
        capture: true,
        passive: false,
      });
      window.addEventListener('touchend', onTouchEnd, {
        capture: true,
        passive: false,
      });
      window.addEventListener('touchcancel', onTouchCancel, {
        capture: true,
        passive: false,
      });
      window.addEventListener('pointermove', onPointerMove, {
        capture: true,
        passive: false,
      });
      window.addEventListener('pointerup', onTouchEnd, {
        capture: true,
        passive: false,
      });
      window.addEventListener('pointercancel', onTouchCancel, {
        capture: true,
        passive: false,
      });
    };

    window.addEventListener('touchstart', onTouchStart, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener('touchstart', onTouchStart, true);

      if (drag) drag.cancel({ shouldBlockNextClick: false });
      stopListening();
    };
  }, [api]);
};
