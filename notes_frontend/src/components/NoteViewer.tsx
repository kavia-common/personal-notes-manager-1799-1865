import { component$ } from '@builder.io/qwik';

interface NoteViewerProps {
  title: string;
  content: string;
  lastUpdated: string;
  onEdit: () => void;
}

/**
 * PUBLIC_INTERFACE
 * Read-only detailed view for a note.
 */
export const NoteViewer = component$((props: NoteViewerProps) => (
  <div class="note-viewer">
    <div class="note-viewer-header">
      <h2 class="note-viewer-title">{props.title || 'Untitled'}</h2>
      <span class="note-viewer-date">
        Last updated: {props.lastUpdated}
      </span>
    </div>
    <div class="note-viewer-content">{props.content}</div>
    <div class="note-viewer-actions">
      <button class="button primary" type="button" onClick$={props.onEdit}>
        Edit
      </button>
    </div>
  </div>
));
