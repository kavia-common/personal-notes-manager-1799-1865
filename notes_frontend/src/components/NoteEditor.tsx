import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import type { QRL } from '@builder.io/qwik';

interface NoteEditorProps {
  title: string;
  content: string;
  isNew: boolean;
  onSave$: QRL<(title: string, content: string) => void>;
  onCancel$: QRL<() => void>;
}

/**
 * PUBLIC_INTERFACE
 * Editor for new/existing notes.
 */
export const NoteEditor = component$((props: NoteEditorProps) => {
  const { title, content, isNew, onSave$, onCancel$ } = props;
  const localTitle = useSignal(title);
  const localContent = useSignal(content);

  // Only reference primitive 'title'/'content' inside tracking scopes.
  useTask$(({ track }) => {
    const newTitle = track(() => props.title);
    localTitle.value = newTitle;
  });
  useTask$(({ track }) => {
    const newContent = track(() => props.content);
    localContent.value = newContent;
  });

  return (
    <form
      class="note-editor"
      onSubmit$={async (ev) => {
        ev.preventDefault();
        await onSave$(localTitle.value, localContent.value);
      }}
      autocomplete="off"
    >
      <input
        class="note-editor-title"
        type="text"
        placeholder="Title"
        value={localTitle.value}
        onInput$={(ev) => {
          const target = ev.target as HTMLInputElement | null;
          if (target) localTitle.value = target.value;
        }}
        required
        aria-label="Note title"
      />
      <textarea
        class="note-editor-content"
        placeholder="Content..."
        value={localContent.value}
        onInput$={(ev) => {
          const target = ev.target as HTMLTextAreaElement | null;
          if (target) localContent.value = target.value;
        }}
        required
        aria-label="Note content"
        rows={10}
      />
      <div class="editor-actions">
        <button class="button primary" type="submit">
          {isNew ? 'Create' : 'Save'}
        </button>
        <button
          class="button secondary"
          type="button"
          onClick$={onCancel$}
        >
          Cancel
        </button>
      </div>
    </form>
  );
});
