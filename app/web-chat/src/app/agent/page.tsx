'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AgentChatPage() {
  const { messages, append, status, stop } = useChat({
    api: '/api/chat',
  });

  const [inputValue, setInputValue] = useState('');

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    append({ role: 'user', content: inputValue });
    setInputValue('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isStreaming = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col h-screen bg-[#111111] text-foreground">
      {/* Header (Optional, keeping it minimal) */}
      <header className="flex items-center px-6 py-4 border-b border-border/10">
        <h1 className="text-xl font-semibold tracking-tight">Avbodh AI</h1>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pt-32 space-y-4 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">How can I help you today?</h2>
              <p className="text-muted-foreground max-w-[400px]">
                I can assist you with answering questions, writing code, or exploring data. Just type a message below to get started.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 shrink-0 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`flex flex-col space-y-2 max-w-[85%] md:max-w-[75%] ${
                    message.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm prose prose-neutral dark:prose-invert max-w-none'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 shrink-0 mt-1">
                    <AvatarFallback className="bg-muted">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box Area */}
      <div className="p-4 bg-[#111111]">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={submitForm}
            className="relative flex items-center bg-muted/50 border rounded-full focus-within:ring-1 focus-within:ring-primary/50 shadow-sm transition-all"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message the agent..."
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-6 py-6 text-base rounded-full shadow-none"
              disabled={status === 'submitted'}
            />
            
            <div className="absolute right-2 flex items-center">
              {isStreaming ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 text-muted-foreground hover:bg-muted"
                  onClick={() => stop()}
                  title="Stop generating"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isStreaming}
                  className="rounded-full h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <ArrowUp className="w-5 h-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              )}
            </div>
          </form>
          <div className="mt-2 text-center">
             <p className="text-xs text-muted-foreground">
               Agent can make mistakes. Consider verifying important information.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
