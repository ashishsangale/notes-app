// src/components/NotesToggle.tsx
import React from 'react';

interface NotesToggleProps {
  showDeletedNotes: boolean;
  onToggle: () => void;
}

const NotesToggle: React.FC<NotesToggleProps> = ({ showDeletedNotes, onToggle }) => {
  return (
    <div className="toggle-button">
      <button className="toggle-deleted-notes" onClick={onToggle}>
        {showDeletedNotes ? "Show Active Notes" : "Show Deleted Notes"}
      </button>
    </div>
  );
};

export default NotesToggle;