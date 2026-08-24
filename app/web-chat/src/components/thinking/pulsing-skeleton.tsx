import React from 'react';
import { Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function PulsingSkeleton() {
  return (
    <div className="flex gap-2 sm:gap-4 justify-start mb-4 sm:mb-6">
      <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-1 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
      </div>
      <div className="flex flex-col gap-2 mt-1 w-full max-w-[80%] sm:max-w-[70%]">
        <Skeleton className="h-4 w-[90%] bg-primary/10" />
        <Skeleton className="h-4 w-[75%] bg-primary/10" />
        <Skeleton className="h-4 w-[50%] bg-primary/10" />
      </div>
    </div>
  );
}
