import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ChatInputActions } from './ChatInputActions';

export function ChatInput({
  inputValue,
  setInputValue,
  onSubmit,
  isStreaming,
  status,
  stop,
}: any) {
  return (
    <div className="w-full">
      <form
        onSubmit={onSubmit}
        className="relative flex items-center bg-[#212121] border border-border/50 rounded-2xl focus-within:ring-1 focus-within:ring-primary/50 shadow-sm transition-all p-0.5 sm:p-1"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground rounded-full h-8 w-8 sm:h-10 sm:w-10 ml-1 hover:bg-muted/50"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="How can I help you today?"
          className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 sm:px-3 py-4 sm:py-6 text-sm sm:text-base shadow-none text-foreground"
          disabled={status === 'submitted'}
        />
        <ChatInputActions
          inputValue={inputValue}
          isStreaming={isStreaming}
          stop={stop}
        />
      </form>
      <div className="mt-3 text-center flex justify-center items-center gap-4">
        <p className="text-xs text-muted-foreground">
          Agent can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
