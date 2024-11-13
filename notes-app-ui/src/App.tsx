// src/App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import NotesToggle from "./components/NotesToggle";

type Note = {
  id: number;
  title: string;
  content: string;
  isDeleted?: boolean;
};

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [showDeletedNotes, setShowDeletedNotes] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/notes");
      const notes: Note[] = await response.json();
      setNotes(notes);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchDeletedNotes = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/notes/deleted");
      const deletedNotes: Note[] = await response.json();
      setDeletedNotes(deletedNotes);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) return;

    try {
      const response = await fetch(
        `http://localhost:5050/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const updatedNote = await response.json();
      setNotes(notes.map((note) => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      await fetch(`http://localhost:5050/api/notes/${noteId}`, {
        method: "DELETE",
      });
      setNotes(notes.filter((note) => note.id !== noteId));
      await fetchDeletedNotes(); // Refresh deleted notes
    } catch (e) {
      console.log(e);
    }
  };

  const handleToggleNotes = async () => {
    if (!showDeletedNotes) {
      await fetchDeletedNotes();
    }
    setShowDeletedNotes(!showDeletedNotes);
  };

  const restoreNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      const response = await fetch(`http://localhost:5050/api/notes/restore/${noteId}`, {
        method: "PUT",
      });
      const restoredNote = await response.json();
  
      // Remove the note from deletedNotes and add it back to the active notes
      setDeletedNotes(deletedNotes.filter((note) => note.id !== noteId));
      setNotes([restoredNote, ...notes]);
    } catch (e) {
      console.log(e);
    }
  };
  

  return (
    <div className="container">
      <div>
        <h1>Notes APP</h1>
      </div>
      <NoteForm
        title={title}
        content={content}
        selectedNote={selectedNote}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={selectedNote ? handleUpdateNote : handleAddNote}
        onCancel={handleCancel}
      />
      
      <NotesToggle 
        showDeletedNotes={showDeletedNotes}
        onToggle={handleToggleNotes}
      />
      
      <NoteList
        notes={showDeletedNotes ? deletedNotes : notes}
        isDeletedNotes={showDeletedNotes}
        onNoteClick={handleNoteClick}
        onDeleteNote={deleteNote}
        onRestoreNote={restoreNote} 
      />
    </div>
  );
};

export default App;