import React from 'react';
import { Bot } from 'lucide-react';

export function BouncingDots() {
  return (
    <div className="flex gap-2 sm:gap-4 justify-start mb-4 sm:mb-6 animate-pulse">
      <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      </div>
      <div className="flex items-center gap-1.5 h-8">
        <span
          className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
