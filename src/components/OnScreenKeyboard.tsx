
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, CornerDownLeft, Delete, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface OnScreenKeyboardProps {
  onClose: () => void;
}

const keyRows = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

export function OnScreenKeyboard({ onClose }: OnScreenKeyboardProps) {
  const keyboardRef = useRef<HTMLDivElement>(null);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 780, height: 320 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });
  const sizeStartRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    setPosition({
      x: window.innerWidth / 2 - size.width / 2,
      y: window.innerHeight / 2 - size.height / 2,
    });
  }, []); // Empty dependency array to run only on mount

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    positionStartRef.current = { ...position };
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    sizeStartRef.current = { ...size };
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: positionStartRef.current.x + dx,
        y: positionStartRef.current.y + dy,
      });
    }
    if (isResizing) {
       const dx = e.clientX - dragStartRef.current.x;
       const dy = e.clientY - dragStartRef.current.y;
      setSize({
        width: Math.max(400, sizeStartRef.current.width + dx),
        height: Math.max(240, sizeStartRef.current.height + dy),
      });
    }
  }, [isDragging, isResizing]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleInteractionMove);
      window.addEventListener('mouseup', handleInteractionEnd, { once: true });
    }
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [isDragging, isResizing, handleInteractionMove, handleInteractionEnd]);
  
  const getKeyClass = (key: string) => {
    switch (key) {
        case 'Backspace':
        case 'Tab':
        case 'Enter':
        case 'Shift':
            return 'flex-grow-[1.5]';
        case 'Caps':
            return 'flex-grow-[1.7]';
        case 'Space':
            return 'flex-grow-[8]';
        case 'Ctrl':
        case 'Alt':
             return 'flex-grow-[1.2]';
        default:
            return 'flex-grow';
    }
  }

  return (
    <div
      ref={keyboardRef}
      className="fixed z-50 flex flex-col rounded-xl border bg-card/60 text-card-foreground shadow-2xl backdrop-blur-sm animate-keyboard-show"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div 
        className="flex h-10 flex-shrink-0 items-center justify-between border-b px-4 cursor-move"
        onMouseDown={handleDragStart}
      >
        <span className="font-semibold text-sm">On-Screen Keyboard</span>
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-grow p-1.5 sm:p-2 space-y-1.5 flex flex-col">
        {keyRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex-grow flex justify-center gap-1.5">
            {row.map((key, keyIndex) => (
              <Button key={`${rowIndex}-${keyIndex}`} variant="outline" className={cn("h-full text-sm sm:text-base capitalize px-2", getKeyClass(key))}>
                {key === 'Backspace' ? <Delete/> : key === 'Enter' ? <CornerDownLeft/> : key === 'Space' ? '' : key}
              </Button>
            ))}
          </div>
        ))}
      </div>
      
      <div 
        className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground/50 rotate-45" />
      </div>
    </div>
  );
}
