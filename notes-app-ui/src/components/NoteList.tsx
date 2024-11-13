import React from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  isDeleted?: boolean;
};

interface NoteListProps {
  notes: Note[];
  isDeletedNotes?: boolean;
  onNoteClick: (note: Note) => void;
  onDeleteNote: (event: React.MouseEvent, noteId: number) => void;
  onRestoreNote?: (event: React.MouseEvent, noteId: number) => void; // Optional prop
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  isDeletedNotes = false,
  onNoteClick,
  onDeleteNote,
  onRestoreNote,
}) => {
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <div
          key={note.id}
          className="note-item"
          onClick={() => !isDeletedNotes && onNoteClick(note)}
        >
          <div className ="notes-header">
            {isDeletedNotes ? (
              <button
                className="restore-btn"
                onClick={(e) => onRestoreNote?.(e, note.id)} // Restore button
              >
                Restore
              </button>
            ) : (
              <button
                className="delete-btn"
                onClick={(e) => onDeleteNote(e, note.id)} // Delete button
              >
                Delete
              </button>
            )}
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
