import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Sidebar } from "../components/Sidebar";
import { NotesList } from "../components/NotesList";
import { NoteEditor } from "../components/NoteEditor";
import { NoteViewer } from "../components/NoteViewer";
import { NotesService } from "./notes.service";

/**
 * Notes app main page - Qwik
 */
export default component$(() => {
  const notes = useSignal<Array<{ id: string; title: string; content: string; lastUpdated: string }>>([]);
  const searchTerm = useSignal('');
  const selectedId = useSignal<string | null>(null);
  const editing = useSignal(false);
  const creating = useSignal(false);

  // Wrap loadNotes so it can be used in useVisibleTask$
  const loadNotes = $((opts?: { forceAll?: boolean }) => {
    if (opts?.forceAll || !searchTerm.value) {
      notes.value = NotesService.getNotes();
    } else {
      notes.value = NotesService.searchNotes(searchTerm.value);
    }
  });

  useVisibleTask$(async () => {
    await loadNotes({ forceAll: true });
    // Auto-pick first note if any
    if (notes.value.length > 0) {
      selectedId.value = notes.value[0].id;
    }
  });

  const selectNote = $((id: string) => {
    selectedId.value = id;
    creating.value = false;
    editing.value = false;
  });

  const handleDelete = $((id: string) => {
    if (window.confirm("Delete this note?")) {
      NotesService.deleteNote(id);
      loadNotes({ forceAll: true });
      // Unselect if deleted note is shown
      if (selectedId.value === id) {
        selectedId.value = notes.value.length ? notes.value[0].id : null;
      }
    }
  });

  const handleSearch = $((term: string) => {
    searchTerm.value = term;
    loadNotes();
    if (notes.value.length) {
      selectedId.value = notes.value[0].id;
    } else {
      selectedId.value = null;
    }
  });

  // For rendering the selected note
  const selectedNote = () =>
    notes.value.find((n) => n.id === selectedId.value) ?? null;

  // Handlers for create/edit (must be QRLs if passed to child)
  const handleSave = $((title: string, content: string) => {
    if (creating.value) {
      const note = NotesService.createNote(title, content);
      loadNotes({ forceAll: true });
      selectedId.value = note.id;
      creating.value = false;
    } else if (editing.value && selectedNote()) {
      NotesService.updateNote(selectedNote()!.id, title, content);
      loadNotes({ forceAll: true });
      editing.value = false;
    }
  });
  const handleCancelCreate = $(() => {
    creating.value = false;
  });
  const handleCancelEdit = $(() => {
    editing.value = false;
  });
  const handleEdit = $(() => {
    editing.value = true;
  });

  return (
    <div class="notes-root">
      <Sidebar onSearch$={handleSearch} searchTerm={searchTerm.value} />
      <div class="notes-main">
        <div class="notes-main-header">
          <button
            class="button accent"
            type="button"
            onClick$={$(() => {
              creating.value = true;
              editing.value = false;
              selectedId.value = null;
            })}
          >
            + New Note
          </button>
        </div>
        <div class="notes-panel">
          <div class="notes-list-panel">
            <NotesList
              notes={notes.value.map((n) => ({
                id: n.id,
                title: n.title,
                lastUpdated: n.lastUpdated.split("T")[0],
              }))}
              selectedId={selectedId.value}
              onSelect$={selectNote}
              onDelete$={handleDelete}
            />
          </div>
          <div class="notes-view-panel">
            {/* Show editor for new, or edit; else viewer */}
            {creating.value && (
              <NoteEditor
                title=""
                content=""
                isNew={true}
                onSave$={handleSave}
                onCancel$={handleCancelCreate}
              />
            )}
            {!creating.value && editing.value && selectedNote() && (
              <NoteEditor
                title={selectedNote()!.title}
                content={selectedNote()!.content}
                isNew={false}
                onSave$={handleSave}
                onCancel$={handleCancelEdit}
              />
            )}
            {!creating.value && !editing.value && selectedNote() && (
              <NoteViewer
                title={selectedNote()!.title}
                content={selectedNote()!.content}
                lastUpdated={selectedNote()!.lastUpdated.split('T')[0]}
                onEdit={handleEdit}
              />
            )}
            {!creating.value && !editing.value && !selectedNote() && (
              <div class="note-empty">
                <span>Select a note or create a new one to begin.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Notes",
  meta: [
    {
      name: "description",
      content: "A simple, modern notes application with Qwik",
    },
  ],
};
