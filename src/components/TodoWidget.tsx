
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, GripVertical, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoWidget() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-app-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const pendingTasks = tasks.filter(task => !task.completed).length;

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target as HTMLElement).closest('.drag-handle')) {
        return;
    }
    e.preventDefault();
    setIsDragging(true);
    positionStartRef.current = { ...position };
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !widgetRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
        x: positionStartRef.current.x + dx,
        y: positionStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => handleMouseMove(e);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleMouseUp, { once: true });
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);


  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  
  if (!tasks || tasks.length === 0) {
      return null;
  }

  return (
    <div
      ref={widgetRef}
      className="fixed z-50"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      {isOpen ? (
        <Card className="w-80 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-lg">To-Do List</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
             <ScrollArea className="h-64 pr-3">
                <div className="space-y-2">
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-3">
                            <Checkbox
                                id={`widget-task-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                            />
                            <label
                                htmlFor={`widget-task-${task.id}`}
                                className={cn("flex-1 text-sm", task.completed ? 'line-through text-muted-foreground' : '')}
                            >
                                {task.text}
                            </label>
                        </div>
                    ))}
                </div>
            </ScrollArea>
             <form onSubmit={addTask} className="flex gap-2 mt-4">
                <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                />
                <Button type="submit" size="icon"><Plus/></Button>
            </form>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button variant="link" asChild className="w-full">
              <Link href="/todo">Go to To-Do App</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="relative">
          <button
            onMouseDown={handleMouseDown}
            className="absolute -left-2 top-1/2 -translate-y-1/2 h-8 w-5 rounded-l-md bg-secondary/50 border border-r-0 hover:bg-accent cursor-move drag-handle flex items-center justify-center"
            >
            <GripVertical className="size-4 text-muted-foreground"/>
          </button>
          <Button
            size="icon"
            className={cn(
                "rounded-full w-14 h-14 shadow-lg transition-colors",
                pendingTasks > 0 ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"
            )}
            onClick={() => setIsOpen(true)}
          >
             <div className="flex flex-col items-center">
                <CheckSquare className="size-6"/>
                {pendingTasks > 0 && <span className="text-xs font-bold">{pendingTasks}</span>}
             </div>
          </Button>
        </div>
      )}
    </div>
  );
}
