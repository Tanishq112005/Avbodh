import { Image as ImageIcon } from 'lucide-react';

export function UserAttachments({ attachments }: { attachments: any[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((att, index) => (
        <div
          key={index}
          className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-lg overflow-hidden border border-border/50 bg-muted/20 flex items-center justify-center"
        >
          {att.contentType?.startsWith('image/') || att.url ? (
            <img
              src={att.url}
              alt={att.name || 'Attachment'}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
              <span className="text-[10px] sm:text-xs">Attachment</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
