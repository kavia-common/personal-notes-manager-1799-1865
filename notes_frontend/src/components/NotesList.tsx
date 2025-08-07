import { component$ } from '@builder.io/qwik';
import type { QRL } from '@builder.io/qwik';

export interface NotePreview {
  id: string;
  title: string;
  lastUpdated: string;
}

interface NotesListProps {
  notes: NotePreview[];
  selectedId: string | null;
  onSelect$: QRL<(id: string) => void>;
  onDelete$: QRL<(id: string) => void>;
}

/**
 * PUBLIC_INTERFACE
 * Notes list sidebar panel; shows all notes, select/delete.
 */
export const NotesList = component$((props: NotesListProps) => {
  return (
    <section class="notes-list">
      {props.notes.length === 0 && (
        <div class="notes-list-empty">No notes found.</div>
      )}
      <ul>
        {props.notes.map((note) => (
          <li
            key={note.id}
            class={{
              'notes-list-item': true,
              'selected': props.selectedId === note.id,
            }}
            onClick$={async () => {
              await props.onSelect$(note.id);
            }}
          >
            <div class="notes-list-title">{note.title || 'Untitled'}</div>
            <div class="notes-list-date">{note.lastUpdated}</div>
            <button
              class="notes-list-delete"
              type="button"
              aria-label="Delete note"
              onClick$={async (ev) => {
                ev.stopPropagation();
                await props.onDelete$(note.id);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
});
