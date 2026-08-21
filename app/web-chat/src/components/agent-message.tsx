import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';

interface AgentMessageProps {
  content: string;
}

export function AgentMessage({ content }: AgentMessageProps) {
  return (
    <div className="flex gap-4 justify-start mb-6 group">
      <Avatar className="w-8 h-8 shrink-0 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary">
          <Bot className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col space-y-2 max-w-[90%] md:max-w-[85%] items-start">
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
