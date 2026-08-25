import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserAttachments } from './UserAttachments';

interface Attachment {
  url: string;
  contentType?: string;
  name?: string;
}
interface UserMessageProps {
  content: string;
  attachments?: Attachment[];
}

export function UserMessage({ content, attachments }: UserMessageProps) {
  return (
    <div className="flex gap-2 sm:gap-4 justify-end mb-4 sm:mb-6">
      <div className="flex flex-col items-end space-y-1 sm:space-y-2 max-w-[90%] sm:max-w-[85%] md:max-w-[75%]">
        <div className="rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3 bg-[#2A2A2A] text-foreground rounded-br-sm flex flex-col gap-2 sm:gap-3 shadow-sm border border-border/10">
          <UserAttachments attachments={attachments || []} />
          <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
            {content}
          </p>
        </div>
      </div>
      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 mt-1">
        <AvatarFallback className="bg-muted text-[10px] sm:text-xs">
          <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
