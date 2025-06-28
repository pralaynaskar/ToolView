'use client';

import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-app-tasks', []);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(task => !task.completed);
    if (filter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  }, [tasks, filter]);

  return (
    <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>To-Do List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             <form onSubmit={addTask} className="flex gap-2">
                <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What needs to be done?"
                />
                <Button type="submit" size="icon"><Plus/></Button>
            </form>

            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                 <ScrollArea className="h-72 mt-4 pr-3">
                    {filteredTasks.length > 0 ? (
                        <ul className="space-y-2">
                            {filteredTasks.map(task => (
                                <li key={task.id} className="flex items-center gap-3 p-2 bg-secondary rounded-md">
                                    <Checkbox
                                        id={`task-${task.id}`}
                                        checked={task.completed}
                                        onCheckedChange={() => toggleTask(task.id)}
                                    />
                                    <label
                                        htmlFor={`task-${task.id}`}
                                        className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                                    >
                                        {task.text}
                                    </label>
                                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            No tasks here.
                        </div>
                    )}
                 </ScrollArea>
            </Tabs>
        </CardContent>
    </Card>
  );
}
