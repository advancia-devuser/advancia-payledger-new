"use client";

import React, { useState, useRef, useEffect } from "react";

interface NoteData {
  id: string;
  content: string;
  color: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  zIndex: number;
  isPinned: boolean;
  createdBy?: { name: string };
}

interface Props {
  note: NoteData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<NoteData>) => void;
  onDelete: () => void;
  onBringToFront?: () => void;
}

const NOTE_COLORS = [
  { name: "Yellow", value: "#fef3c7", text: "#92400e" },
  { name: "Pink", value: "#fce7f3", text: "#831843" },
  { name: "Blue", value: "#dbeafe", text: "#1e3a8a" },
  { name: "Green", value: "#d1fae5", text: "#064e3b" },
  { name: "Purple", value: "#e9d5ff", text: "#581c87" },
  { name: "Orange", value: "#fed7aa", text: "#7c2d12" },
];

export const StickyNote: React.FC<Props> = ({
  note,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onBringToFront,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [content, setContent] = useState(note.content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: note.width,
    height: note.height,
  });

  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  }>({
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
  });
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  }>({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  useEffect(() => {
    setContent(note.content);
    setDimensions({ width: note.width, height: note.height });
  }, [note.content, note.width, note.height]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === textareaRef.current) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: note.positionX,
      startPosY: note.positionY,
    };

    if (onBringToFront) {
      onBringToFront();
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: dimensions.width,
      startHeight: dimensions.height,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      const newX = Math.max(0, dragRef.current.startPosX + deltaX);
      const newY = Math.max(0, dragRef.current.startPosY + deltaY);

      onUpdate({
        positionX: newX,
        positionY: newY,
      });
    }

    if (isResizing) {
      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      const newWidth = Math.max(150, resizeRef.current.startWidth + deltaX);
      const newHeight = Math.max(100, resizeRef.current.startHeight + deltaY);

      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    if (
      isResizing &&
      (dimensions.width !== note.width || dimensions.height !== note.height)
    ) {
      onUpdate({
        width: dimensions.width,
        height: dimensions.height,
      });
    }

    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dimensions]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleContentBlur = () => {
    setIsEditing(false);
    if (content !== note.content) {
      onUpdate({ content });
    }
  };

  const handleColorChange = (color: string) => {
    onUpdate({ color });
    setShowColorPicker(false);
  };

  const handlePinToggle = () => {
    onUpdate({ isPinned: !note.isPinned });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this note?")) {
      onDelete();
    }
  };

  const currentColor =
    NOTE_COLORS.find((c) => c.value === note.color) || NOTE_COLORS[0];

  return (
    <div
      ref={noteRef}
      className={`absolute shadow-lg rounded-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${
        note.isPinned ? "ring-2 ring-red-400" : ""
      }`}
      style={{
        left: `${note.positionX}px`,
        top: `${note.positionY}px`,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundColor: note.color,
        zIndex: note.zIndex,
        transform: isDragging ? "scale(1.05)" : "scale(1)",
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-black/20">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="w-4 h-4 rounded-full border-2 border-black/30 hover:border-black/50"
            style={{ backgroundColor: note.color }}
          />
          {note.isPinned && <span className="text-xs">📌</span>}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePinToggle();
            }}
            className="p-1 hover:bg-black/10 rounded"
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1 hover:bg-black/10 rounded text-red-500"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="absolute top-8 left-2 bg-white rounded-lg shadow-lg border p-2 z-50">
          <div className="grid grid-cols-3 gap-1">
            {NOTE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className="w-6 h-6 rounded border-2 border-black/30 hover:border-black/50"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-2 h-full">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onBlur={handleContentBlur}
          onFocus={() => setIsEditing(true)}
          className="w-full h-full bg-transparent resize-none outline-none text-sm"
          style={{ color: currentColor.text }}
          placeholder="Type your note here..."
        />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
      >
        <svg className="w-full h-full" viewBox="0 0 16 16">
          <path d="M8 12l-4-4h8z" fill="currentColor" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};
