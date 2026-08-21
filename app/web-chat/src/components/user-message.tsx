import React from 'react';
import { User, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
    <div className="flex gap-4 justify-end mb-6">
      <div className="flex flex-col items-end space-y-2 max-w-[85%] md:max-w-[75%]">
        <div className="rounded-2xl px-5 py-3 bg-[#2A2A2A] text-foreground rounded-br-sm flex flex-col gap-3 shadow-sm border border-border/10">
          
          {/* Attachments rendering */}
          {attachments && attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((att, index) => (
                <div key={index} className="relative w-48 h-48 rounded-lg overflow-hidden border border-border/50 bg-muted/20 flex items-center justify-center">
                  {att.contentType?.startsWith('image/') || att.url ? (
                    <img 
                      src={att.url} 
                      alt={att.name || "Attachment"} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">Attachment</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
            {content}
          </p>
        </div>
      </div>
      
      <Avatar className="w-8 h-8 shrink-0 mt-1">
        <AvatarFallback className="bg-muted">
          <User className="w-4 h-4 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
