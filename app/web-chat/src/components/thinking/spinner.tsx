import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

export function Spinner() {
  return (
    <div className="flex gap-2 sm:gap-4 justify-start mb-4 sm:mb-6">
      <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center">
        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      </div>
      <div className="flex items-center gap-2 h-8">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-sm text-muted-foreground animate-pulse">Thinking...</span>
      </div>
    </div>
  );
}
