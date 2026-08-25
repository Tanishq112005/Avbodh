'use client';

import { useChatStore } from '@/store/chat';
import { useChatArea } from './useChatArea';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputArea } from './ChatInputArea';

export function ChatArea() {
  const threadId = useChatStore((s) => s.threadId);
  return <ChatAreaInner key={threadId} threadId={threadId} />;
}

function ChatAreaInner({ threadId }: { threadId: string }) {
  const chat = useChatArea(threadId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#151515] text-foreground relative overflow-hidden">
      <div className="flex-1 overflow-y-auto relative z-0">
        <div className="mx-auto max-w-3xl px-3 md:px-6 lg:px-8 pt-4 md:pt-8 pb-32 md:pb-36">
          {!chat.isNewChat && (
            <ChatMessageList messages={chat.messages} status={chat.status} messagesEndRef={chat.messagesEndRef} />
          )}
        </div>
      </div>
      <ChatInputArea chat={chat} />
    </div>
  );
}