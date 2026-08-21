import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-[260px] h-full bg-[#171717] border-r border-border/10 shrink-0">
      <div className="p-3">
        <Button variant="outline" className="w-full justify-start gap-2 bg-[#212121] border-border/20 hover:bg-[#2A2A2A] text-foreground h-10">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 pt-0">
        <div className="text-xs font-semibold text-muted-foreground/80 px-2 py-3">
          Recent
        </div>
        {/* Dummy placeholder item for chat history */}
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg bg-[#212121] cursor-pointer text-sm text-foreground transition-colors group">
          <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="truncate">Design chat layout...</span>
        </div>
      </div>
      
      <div className="p-4 border-t border-border/10 text-sm text-muted-foreground">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[#212121] cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">U</div>
          <span className="truncate">User Options</span>
        </div>
      </div>
    </div>
  );
}
