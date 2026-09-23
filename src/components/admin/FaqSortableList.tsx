"use client";

import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type ScreenReaderInstructions,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useId, useSyncExternalStore } from "react";
import {
  describeFaqPlacement,
  describeFaqPosition,
  toHumanPosition,
} from "@/lib/faq-validation";
import { MEDIA } from "@/lib/motion";
import type { AdminFaqItem } from "./faq-form-state";

const DRAG_ACTIVATION_DISTANCE_PX = 4;
const NOT_FOUND_INDEX = -1;

const SCREEN_READER_INSTRUCTIONS: ScreenReaderInstructions = {
  draggable:
    "Para reordenar, pressione espaço ou enter. Use as setas para cima e para baixo para mover, espaço ou enter para soltar e Esc para cancelar.",
};

function subscribeToMotionPreference(onChange: () => void): () => void {
  const query = window.matchMedia(MEDIA.anyMotion);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readMotionAllowed(): boolean {
  return window.matchMedia(MEDIA.anyMotion).matches;
}

function readServerMotionAllowed(): boolean {
  return false;
}

type FaqSortableListProps = {
  items: ReadonlyArray<AdminFaqItem>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (ids: string[]) => void;
  rowButtonId: (id: string) => string;
};

function GripIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="5.5" cy="3.5" r="1.25" />
      <circle cx="10.5" cy="3.5" r="1.25" />
      <circle cx="5.5" cy="8" r="1.25" />
      <circle cx="10.5" cy="8" r="1.25" />
      <circle cx="5.5" cy="12.5" r="1.25" />
      <circle cx="10.5" cy="12.5" r="1.25" />
    </svg>
  );
}

type FaqRowProps = {
  item: AdminFaqItem;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  buttonId: string;
  motionAllowed: boolean;
};

function FaqRow({
  item,
  index,
  selected,
  onSelect,
  buttonId,
  motionAllowed,
}: FaqRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: motionAllowed ? undefined : null,
  });

  return (
    <li
      ref={setNodeRef}
      className="faq-row"
      data-selected={selected}
      data-dragging={isDragging}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        className="faq-row__handle"
        {...attributes}
        {...listeners}
        aria-label={`Reordenar: ${item.question}`}
      >
        <GripIcon />
      </button>
      <button
        id={buttonId}
        type="button"
        className="faq-row__select"
        aria-current={selected || undefined}
        onClick={() => onSelect(item.id)}
      >
        <span className="faq-row__index">{toHumanPosition(index)}</span>
        <span className="faq-row__question">{item.question}</span>
        {item.published ? null : (
          <span className="faq-row__draft">Rascunho</span>
        )}
      </button>
    </li>
  );
}

export function FaqSortableList({
  items,
  selectedId,
  onSelect,
  onReorder,
  rowButtonId,
}: FaqSortableListProps) {
  const contextId = useId();
  const motionAllowed = useSyncExternalStore(
    subscribeToMotionPreference,
    readMotionAllowed,
    readServerMotionAllowed,
  );
  const ids = items.map((item) => item.id);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE_PX },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function indexOf(id: UniqueIdentifier | undefined): number {
    return id === undefined ? NOT_FOUND_INDEX : ids.indexOf(String(id));
  }

  function questionOf(id: UniqueIdentifier): string {
    return items.find((item) => item.id === String(id))?.question ?? "";
  }

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Pergunta "${questionOf(active.id)}" pega. ${describeFaqPosition(indexOf(active.id), ids.length)}`,
    onDragOver: ({ over }) =>
      over
        ? describeFaqPosition(indexOf(over.id), ids.length)
        : "Fora da lista.",
    onDragEnd: ({ over }) =>
      over
        ? describeFaqPlacement(indexOf(over.id), ids.length)
        : "Pergunta solta fora da lista. A ordem não mudou.",
    onDragCancel: () =>
      "Movimento cancelado. A pergunta voltou para a posição original.",
  };

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = indexOf(active.id);
    const to = indexOf(over.id);
    if (from === NOT_FOUND_INDEX || to === NOT_FOUND_INDEX) return;
    onReorder(arrayMove(ids, from, to));
  }

  return (
    <DndContext
      id={contextId}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: SCREEN_READER_INSTRUCTIONS,
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ol className="faq-list">
          {items.map((item, index) => (
            <FaqRow
              key={item.id}
              item={item}
              index={index}
              selected={item.id === selectedId}
              onSelect={onSelect}
              buttonId={rowButtonId(item.id)}
              motionAllowed={motionAllowed}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}
