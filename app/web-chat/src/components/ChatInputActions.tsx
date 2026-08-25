import { Button } from '@/components/ui/button';
import { ArrowUp, Loader2, Mic } from 'lucide-react';

export function ChatInputActions({
  inputValue,
  isStreaming,
  stop,
}: {
  inputValue: string;
  isStreaming: boolean;
  stop: () => void;
}) {
  return (
    <div className="flex items-center gap-1 pr-1 sm:pr-2 shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-muted/50 hidden sm:flex"
      >
        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>
      {isStreaming ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground hover:bg-muted/50"
          onClick={() => stop()}
          title="Stop generating"
        >
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim() || isStreaming}
          className="rounded-full h-8 w-8 sm:h-10 sm:w-10 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      )}
    </div>
  );
}
