// src/components/NoteForm.tsx
import React from 'react';

type Note = {
  id: number;
  title: string;
  content: string;
  isDeleted?: boolean;
};

interface NoteFormProps {
  title: string;
  content: string;
  selectedNote: Note | null;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  title,
  content,
  selectedNote,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form className="note-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Content"
        rows={10}
        required
      />
      {selectedNote ? (
        <div className="edit-buttons">
          <button type="submit">Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      ) : (
        <button type="submit">Add Note</button>
      )}
    </form>
  );
};

export default NoteForm;