'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatInput } from '@/components/chat-input';
import { UserMessage } from '@/components/user-message';
import { AgentMessage } from '@/components/agent-message';

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
            messages.map((message) => {
              if (message.role === 'user') {
                return (
                  <UserMessage 
                    key={message.id} 
                    content={message.content} 
                    attachments={(message as any).experimental_attachments}
                  />
                );
              }
              
              return (
                <AgentMessage 
                  key={message.id} 
                  content={message.content} 
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box Area */}
      <ChatInput 
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={submitForm}
        isStreaming={isStreaming}
        status={status}
        stop={stop}
      />
    </div>
  );
}
