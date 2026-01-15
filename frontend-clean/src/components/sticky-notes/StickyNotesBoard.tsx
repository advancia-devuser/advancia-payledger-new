"use client";

import React, { useState, useEffect, useRef } from "react";
import { StickyNote } from "./StickyNote";

interface Note {
  id: string;
  content: string;
  color: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned: boolean;
  tags: string[];
  createdBy: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  notes: Note[];
}

interface Props {
  boardId: string;
}

export const StickyNotesBoard: React.FC<Props> = ({ boardId }) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Fetch board and notes
  useEffect(() => {
    fetchBoard();
  }, [boardId]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/sticky-notes/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch board");
      }

      const boardData = await response.json();
      setBoard(boardData);
      setNotes(boardData.notes || []);
    } catch (error) {
      console.error("Error fetching board:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (positionX: number, positionY: number) => {
    try {
      const response = await fetch("/api/sticky-notes/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          boardId,
          positionX,
          positionY,
          content: "",
          color: "#fef3c7",
          width: 200,
          height: 200,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setSelectedNoteId(newNote.id);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const response = await fetch(`/api/sticky-notes/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      const updatedNote = await response.json();
      setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/sticky-notes/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes(notes.filter((note) => note.id !== noteId));
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleBoardDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 100; // Center note (200px width / 2)
      const y = e.clientY - rect.top - 100; // Center note (200px height / 2)
      createNote(x, y);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Board not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
          {board.description && (
            <p className="text-sm text-gray-600 mt-1">{board.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const centerX = 400;
              const centerY = 300;
              createNote(centerX, centerY);
            }}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Note
          </button>
        </div>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        className="flex-1 relative overflow-auto"
        style={{ backgroundColor: board.color }}
        onDoubleClick={handleBoardDoubleClick}
      >
        {notes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">No notes yet</p>
              <p className="text-sm">
                Double-click anywhere or click "Add Note" to create one
              </p>
            </div>
          </div>
        )}

        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={() => setSelectedNoteId(note.id)}
            onUpdate={(updates) => updateNote(note.id, updates)}
            onDelete={() => deleteNote(note.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t px-6 py-2 text-xs text-gray-500 flex items-center justify-center gap-4">
        <span>💡 Double-click to create a note</span>
        <span>•</span>
        <span>Drag to move notes</span>
        <span>•</span>
        <span>Click to edit</span>
      </div>
    </div>
  );
};
