'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useRef, useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { ChatInput } from '@/components/chat-input';
import { UserMessage } from '@/components/user-message';
import { AgentMessage } from '@/components/agent-message';
import { ThinkingIndicator } from '@/components/thinking';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { getDynamicGreeting } from '@/lib/time';

import { motion, AnimatePresence } from 'framer-motion';

export function ChatArea() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' })
  });

  const [inputValue, setInputValue] = useState('');
  const [greeting, setGreeting] = useState('Avbodh AI');
  
  // Use Shadcn UI hook directly instead of Zustand
  const { state, isMobile } = useSidebar();
  const isSidebarOpen = state === 'expanded' && !isMobile;

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage({ 
      role: 'user', 
      parts: [{ type: 'text', text: inputValue }] 
    });
    setInputValue('');
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The first time a user sends a message, the input box performs a heavy 700ms 
    // CSS transition from the center of the screen to the bottom. 
    // If we call scrollIntoView during this transition, it forces the browser to 
    // recalculate the layout repeatedly, causing extreme lag.
    // Since the first few messages easily fit on the screen without scrolling anyway,
    // we simply disable scrolling completely for the first exchange.
    if (messages.length > 2) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  useEffect(() => {
    setGreeting(getDynamicGreeting());
  }, []);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const isNewChat = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#151515] text-foreground relative overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative z-0">
        <div className="mx-auto max-w-3xl px-3 md:px-6 lg:px-8 pt-4 md:pt-8 pb-32 md:pb-36">
          {!isNewChat && (
            <div className="space-y-4 md:space-y-6">
              {messages.map((message) => {
                if (message.role === 'user') {
                  return (
                    <UserMessage 
                      key={message.id} 
                      content={message.parts?.filter(p => p.type === 'text').map(p => (p as any).text).join('') || ''} 
                      attachments={(message as any).experimental_attachments}
                    />
                  );
                }
                
                return (
                  <AgentMessage 
                    key={message.id} 
                    content={message.parts?.filter(p => p.type === 'text').map(p => (p as any).text).join('') || ''} 
                  />
                );
              })}
              
              {/* Thinking Indicator */}
              {messages.length > 0 && 
               messages[messages.length - 1].role === 'user' && 
               (status === 'submitted' || status === 'streaming') && (
                <ThinkingIndicator style="dots" />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute inset-0 pointer-events-none flex flex-col z-10 pt-4 md:pt-8">
        {/* Full-width docked background gradient */}
        <div className={`absolute inset-x-0 bottom-0 h-32 md:h-40 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none transition-opacity duration-700 ${isNewChat ? 'opacity-0' : 'opacity-100'} z-0`} />
        
        <div className={`relative z-10 flex-1 flex flex-row w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isNewChat ? 'items-center pb-[10vh] md:pb-[15vh]' : 'items-end pb-2 md:pb-4'}`}>
          
          {/* Extra space on the left as requested by user to push chat right */}
          {isNewChat && isSidebarOpen && (
            <div className="hidden md:block w-[12rem] shrink-[5] transition-all duration-300" />
          )}

          <div className="pointer-events-auto w-[94%] sm:w-[86%] md:w-[72%] lg:w-[68%] lg:max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence mode="popLayout">
              {isNewChat && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center text-center mb-6 md:mb-8"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground flex items-center gap-2 md:gap-3">
                    <Bot className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
                    {greeting}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div layout transition={{ type: "spring", bounce: 0, duration: 0.7 }} className="w-full">
              <ChatInput 
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSubmit={submitForm}
                isStreaming={isStreaming}
                status={status}
                stop={stop}
              />
              
              <AnimatePresence>
                {isNewChat && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 px-2"
                  >
                    {['Write', 'Learn', 'Code', 'Life stuff'].map((pill) => (
                      <button 
                        key={pill} 
                        type="button"
                        onClick={() => setInputValue(`Help me ${pill.toLowerCase()}`)}
                        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border/50 bg-[#111111] hover:bg-muted text-xs md:text-sm text-muted-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
                      >
                        {pill}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}