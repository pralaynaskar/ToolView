
'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useMemo } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, X, Bot, User, Loader2, Cpu, Trash2, Plus, Pencil, PanelLeftClose, PanelRightClose } from 'lucide-react';
import Image from 'next/image';
import { askAI, AiChatInput } from '@/ai/flows/aiChatFlow';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryEntry } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

// Data Structures
interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

const googleModels = [
    { id: 'googleai/gemini-2.0-flash', name: 'Gemini 2.0 Flash', vision: true },
    { id: 'googleai/gemini-1.5-flash', name: 'Gemini 1.5 Flash', vision: true },
    { id: 'googleai/gemini-pro', name: 'Gemini Pro', vision: true },
  ];
  
const ChatListSidebar = ({
    isCollapsed,
    toggleCollapse,
    chatSessions,
    activeChatId,
    setActiveChatId,
    handleAddNewChat,
    handleDeleteChat,
    handleStartEditing,
    editingChatId,
    editingChatName,
    setEditingChatName,
    handleFinishEditing
}: any) => {

    if (isCollapsed) {
        return (
            <div className="bg-secondary/50 flex flex-col p-2 gap-2 border-r">
                <div className="flex justify-center">
                    <Button variant="ghost" size="icon" onClick={toggleCollapse}>
                        <PanelRightClose className="size-5" />
                    </Button>
                </div>
                <Separator />
                <TooltipProvider delayDuration={0}>
                    <ScrollArea className="flex-1">
                        <div className="space-y-1">
                        {chatSessions.map((chat: ChatSession) => (
                            <Tooltip key={chat.id}>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant={activeChatId === chat.id ? 'secondary' : 'ghost'} 
                                        size="icon" 
                                        className="w-full"
                                        onClick={() => setActiveChatId(chat.id)}
                                    >
                                        <Bot className="size-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right"><p>{chat.name}</p></TooltipContent>
                            </Tooltip>
                        ))}
                        </div>
                    </ScrollArea>
                </TooltipProvider>
                <Separator />
                <TooltipProvider delayDuration={0}>
                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleAddNewChat}>
                                <Plus className="size-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right"><p>New Chat</p></TooltipContent>
                     </Tooltip>
                </TooltipProvider>
            </div>
        );
    }
    
    return (
        <div className="bg-secondary/50 flex flex-col border-r">
            <div className="p-2 border-b flex justify-between items-center">
                <h3 className="font-semibold px-2">Chats</h3>
                <Button variant="ghost" size="icon" onClick={toggleCollapse}>
                    <PanelLeftClose className="size-5" />
                </Button>
            </div>
            <ScrollArea className="flex-1 p-2">
                {chatSessions.map((chat: ChatSession) => (
                    <div key={chat.id} className={cn("group flex items-center gap-2 rounded-md", activeChatId === chat.id && "bg-accent")}>
                       {editingChatId === chat.id ? (
                           <Input
                               value={editingChatName}
                               onChange={e => setEditingChatName(e.target.value)}
                               onBlur={handleFinishEditing}
                               onKeyDown={e => e.key === 'Enter' && handleFinishEditing()}
                               autoFocus
                               className="h-9"
                           />
                       ) : (
                           <Button
                               variant="ghost"
                               className="flex-1 justify-start text-left"
                               onClick={() => setActiveChatId(chat.id)}
                           >
                               <span className="truncate">{chat.name}</span>
                           </Button>
                       )}
                       <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => handleStartEditing(chat)}><Pencil className="size-4" /></Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100" disabled={chatSessions.length <= 1}><Trash2 className="size-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete "{chat.name}"?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteChat(chat.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                       </AlertDialog>
                    </div>
                ))}
            </ScrollArea>
            <div className="p-2 border-t">
                <Button variant="outline" className="w-full" onClick={handleAddNewChat}>
                    <Plus className="mr-2" /> New Chat
                </Button>
            </div>
        </div>
    );
};

export default function GeminiChat() {
    const [chatSessions, setChatSessions] = useLocalStorage<ChatSession[]>('gemini-chat-sessions', []);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingChatName, setEditingChatName] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [, setHistory] = useLocalStorage<HistoryEntry[]>('calc-history', []);
    const [input, setInput] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [model, setModel] = useState(googleModels[0].id);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    
    const selectedModel = googleModels.find(m => m.id === model);

    // Initialize or select a chat on load
    useEffect(() => {
        if (chatSessions.length === 0) {
            const newChatId = Date.now().toString();
            setChatSessions([{ id: newChatId, name: 'Chat 1', messages: [] }]);
            setActiveChatId(newChatId);
        } else if (!activeChatId || !chatSessions.find(c => c.id === activeChatId)) {
            setActiveChatId(chatSessions[0].id);
        }
    }, [chatSessions, setChatSessions, activeChatId]);


    // Auto-scroll logic
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollableView = scrollAreaRef.current.querySelector('div');
            if (scrollableView) {
                scrollableView.scrollTop = scrollableView.scrollHeight;
            }
        }
      }, [chatSessions.find(c => c.id === activeChatId)?.messages, isLoading]);

    const activeChat = chatSessions.find(c => c.id === activeChatId);
    
    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    // Handlers
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          if (file.size > 4 * 1024 * 1024) { // 4MB limit
            toast({ variant: "destructive", title: "Image too large", description: "Please select an image smaller than 4MB." });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => setImage(reader.result as string);
          reader.onerror = () => toast({ variant: "destructive", title: "Error reading file", description: "There was an issue processing your image." });
          reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async () => {
        if (isLoading || (!input.trim() && !image) || !activeChatId) return;
    
        if (image && !selectedModel?.vision) {
            toast({ variant: "destructive", title: "Model does not support images", description: `The selected model (${selectedModel?.name}) cannot process images.`});
            return;
        }

        const userMessage: Message = { role: 'user', content: input, ...(image && { image }) };
        
        setChatSessions(prev => prev.map(chat => 
            chat.id === activeChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
        ));
        
        setIsLoading(true);
        const currentInput = input;
        const currentImage = image;
        setInput('');
        setImage(null);

        try {
            const payload: AiChatInput = { prompt: currentInput, model: model };
            if (currentImage) payload.image = currentImage;
            
            const response = await askAI(payload);
    
            setChatSessions(prev => prev.map(chat => 
                chat.id === activeChatId ? { ...chat, messages: [...chat.messages, { role: 'model', content: response }] } : chat
            ));
            
            const newHistoryEntry: HistoryEntry = {
                id: new Date().toISOString(),
                type: `Gemini Chat (${activeChat?.name || 'Chat'})`,
                calculation: `Q: ${currentInput.substring(0, 25)}... A: ${response.substring(0, 35)}...`,
                timestamp: new Date().toISOString(),
            };
            setHistory(prev => [newHistoryEntry, ...prev.slice(0, 49)]);

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "An error occurred", description: "Failed to get a response from the AI. Please check your API key and try again." });
            // Revert message on error
            setChatSessions(prev => prev.map(chat => 
                chat.id === activeChatId ? { ...chat, messages: chat.messages.slice(0, -1) } : chat
            ));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNewChat = () => {
        const newChatId = Date.now().toString();
        const newChat: ChatSession = {
            id: newChatId,
            name: `Chat ${chatSessions.length + 1}`,
            messages: [],
        };
        setChatSessions(prev => [...prev, newChat]);
        setActiveChatId(newChatId);
    };

    const handleDeleteChat = (chatId: string) => {
        setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
        if (activeChatId === chatId) {
            // If active chat is deleted, switch to the first one or null
            const newSessions = chatSessions.filter(chat => chat.id !== chatId);
            setActiveChatId(newSessions.length > 0 ? newSessions[0].id : null);
        }
    };

    const handleStartEditing = (chat: ChatSession) => {
        setEditingChatId(chat.id);
        setEditingChatName(chat.name);
    };

    const handleFinishEditing = () => {
        if (!editingChatId) return;
        setChatSessions(prev => prev.map(chat => 
            chat.id === editingChatId ? { ...chat, name: editingChatName.trim() || chat.name } : chat
        ));
        setEditingChatId(null);
    };
    
    return (
        <div className={cn(
            "grid h-[75vh] border rounded-lg overflow-hidden transition-all duration-300",
            isSidebarCollapsed ? "grid-cols-[60px_1fr]" : "grid-cols-[250px_1fr]"
        )}>
            {/* Chat List Sidebar */}
            <ChatListSidebar 
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={toggleSidebar}
                chatSessions={chatSessions}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                handleAddNewChat={handleAddNewChat}
                handleDeleteChat={handleDeleteChat}
                handleStartEditing={handleStartEditing}
                editingChatId={editingChatId}
                editingChatName={editingChatName}
                setEditingChatName={setEditingChatName}
                handleFinishEditing={handleFinishEditing}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <div className="p-2 border-b flex items-center justify-end flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-muted-foreground" />
                                <Select value={model} onValueChange={setModel} disabled={isLoading}>
                                    <SelectTrigger className="w-auto md:w-[220px] text-sm"><SelectValue placeholder="Select a model" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Google</SelectLabel>
                                            {googleModels.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <ScrollArea className="flex-1" ref={scrollAreaRef}>
                            <div className="p-6 space-y-6">
                                {activeChat.messages.length === 0 && !isLoading && (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground pt-16">
                                    <Bot className="w-16 h-16 mb-4 text-primary/50" />
                                    <h2 className="text-2xl font-semibold">Gemini Chat</h2>
                                    <p className="max-w-md">Ask me anything, describe an image, or get help with a task. I can understand both text and images.</p>
                                    </div>
                                )}
                                {activeChat.messages.map((message, index) => (
                                    <div key={index} className={cn('flex items-start gap-4', { 'justify-end': message.role === 'user' })}>
                                        {message.role === 'model' && <Bot className="w-8 h-8 flex-shrink-0 text-primary mt-1" />}
                                        <div className={cn('rounded-lg p-3 max-w-[85%] text-sm md:text-base', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                            {message.image && <div className="mb-2" data-ai-hint="user upload"><Image src={message.image} alt="User upload" width={200} height={200} className="rounded-md max-w-full h-auto" /></div>}
                                            {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                                        </div>
                                        {message.role === 'user' && <User className="w-8 h-8 flex-shrink-0 bg-muted-foreground/20 text-muted-foreground p-1.5 rounded-full mt-1" />}
                                    </div>
                                ))}
                                {isLoading && <div className="flex items-start gap-4"><Bot className="w-8 h-8 flex-shrink-0 text-primary mt-1" /><div className="rounded-lg p-3 bg-secondary flex items-center space-x-2"><Loader2 className="w-5 h-5 animate-spin" /><span>Thinking...</span></div></div>}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background/80">
                            {image && <div className="relative w-24 h-24 mb-2"><Image src={image} alt="Preview" fill objectFit="cover" className="rounded-md" data-ai-hint="image preview" /><Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setImage(null)}><X className="h-4 w-4" /></Button></div>}
                            <div className="relative">
                                <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} placeholder="Ask anything or describe the image..." className="pr-24 pl-12 py-3 min-h-[52px] resize-none" rows={1} disabled={isLoading} />
                                <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={() => fileInputRef.current?.click()} disabled={isLoading || !selectedModel?.vision} aria-label="Attach image" title={!selectedModel?.vision ? "Selected model does not support images" : "Attach Image"}><Paperclip className="h-5 w-5" /></Button>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSendMessage} disabled={isLoading || (!input.trim() && !image)} aria-label="Send message">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}</Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground"><Bot className="w-16 h-16 mb-4 text-primary/50" /><h2 className="text-2xl font-semibold">Gemini Chat</h2><p>Select a chat or create a new one to begin.</p></div>
                )}
            </div>
        </div>
    );
}
