export interface Note {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

// PUBLIC_INTERFACE
/**
 * Service for CRUD operations for Notes.
 * This is a stub/mock using browser localStorage for persistence.
 */
export class NotesService {
  private static key = 'notes-db-v1';

  static getNotes(): Note[] {
    const raw: Note[] = JSON.parse(localStorage.getItem(NotesService.key) ?? '[]');
    // Sort by lastUpdated desc
    return raw.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }

  static getNote(id: string): Note | undefined {
    return NotesService.getNotes().find(n => n.id === id);
  }

  static createNote(title: string, content: string): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: Math.random().toString(36).slice(2, 12) + Date.now(),
      title,
      content,
      lastUpdated: now,
    };
    const notes = NotesService.getNotes();
    notes.push(note);
    localStorage.setItem(NotesService.key, JSON.stringify(notes));
    return note;
  }

  static updateNote(id: string, title: string, content: string): Note | undefined {
    const notes = NotesService.getNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return undefined;
    notes[idx] = { ...notes[idx], title, content, lastUpdated: new Date().toISOString() };
    localStorage.setItem(NotesService.key, JSON.stringify(notes));
    return notes[idx];
  }

  static deleteNote(id: string): boolean {
    const notes = NotesService.getNotes();
    const newNotes = notes.filter(n => n.id !== id);
    if (notes.length === newNotes.length) return false;
    localStorage.setItem(NotesService.key, JSON.stringify(newNotes));
    return true;
  }

  static searchNotes(term: string): Note[] {
    const lower = term.trim().toLowerCase();
    if (!lower) return NotesService.getNotes();
    const notes = NotesService.getNotes();
    return notes.filter(n =>
      n.title.toLowerCase().includes(lower) ||
      n.content.toLowerCase().includes(lower)
    );
  }
}
