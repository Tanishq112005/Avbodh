import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AgentMessageProps {
  content: string;
}

export function AgentMessage({ content }: AgentMessageProps) {
  return (
    <div className="flex gap-2 sm:gap-4 justify-start mb-4 sm:mb-6 group">
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs">
          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col space-y-1 sm:space-y-2 max-w-[92%] sm:max-w-[90%] md:max-w-[85%] items-start">
        <div className="prose prose-sm sm:prose-base prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed overflow-x-auto prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
