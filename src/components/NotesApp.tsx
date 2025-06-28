
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, FileText, Search, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export default function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes-app-data', []);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!activeNoteId && notes.length > 0) {
      setActiveNoteId(notes[0].id);
    }
    if (activeNoteId && !notes.some(n => n.id === activeNoteId)) {
        setActiveNoteId(notes.length > 0 ? notes[0].id : null);
    }
  }, [notes, activeNoteId]);

  const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId), [notes, activeNoteId]);
  
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, searchTerm]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, field: 'title' | 'content', value: string) => {
    setNotes(
      notes.map(note =>
        note.id === id
          ? { ...note, [field]: value, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const handleDownload = (note: Note) => {
    const textToSave = `# ${note.title}\n\n${note.content}`;
    const blob = new Blob([textToSave], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note'}.txt`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-[75vh] border rounded-lg overflow-hidden">
      <div className="md:col-span-1 border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">Notes</h2>
            <Button size="icon" onClick={createNote}><Plus/></Button>
        </div>
        <div className="p-2 border-b">
             <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search notes..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredNotes.length > 0 ? (
             filteredNotes.map(note => (
                <button
                    key={note.id}
                    className={cn(
                        "w-full text-left p-3 border-b hover:bg-accent",
                        activeNoteId === note.id && "bg-secondary"
                    )}
                    onClick={() => setActiveNoteId(note.id)}
                >
                    <h3 className="font-semibold truncate">{note.title || 'Untitled'}</h3>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </p>
                </button>
             ))
          ) : (
             <div className="p-4 text-center text-muted-foreground text-sm">No notes found.</div>
          )}
        </ScrollArea>
      </div>
      <div className="md:col-span-3 flex flex-col">
        {activeNote ? (
          <>
            <div className="p-4 border-b flex justify-end gap-2">
                 <Button variant="outline" size="icon" onClick={() => handleDownload(activeNote)}>
                    <Download />
                 </Button>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon"><Trash2 /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the note titled "{activeNote.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteNote(activeNote.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="p-4">
                 <Input
                    value={activeNote.title}
                    onChange={(e) => updateNote(activeNote.id, 'title', e.target.value)}
                    placeholder="Note Title"
                    className="text-2xl font-bold border-none focus-visible:ring-0 shadow-none p-0"
                />
            </div>
            <ScrollArea className="flex-1">
                <Textarea
                    value={activeNote.content}
                    onChange={(e) => updateNote(activeNote.id, 'content', e.target.value)}
                    placeholder="Start writing..."
                    className="w-full h-full p-4 border-none focus-visible:ring-0 shadow-none resize-none text-base"
                />
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            <FileText className="size-16" />
            <h3 className="text-xl font-medium">No note selected</h3>
            <p>Select a note from the list or create a new one.</p>
            <Button onClick={createNote}>Create New Note</Button>
          </div>
        )}
      </div>
    </div>
  );
}
