'use client';

import { Sidebar } from './sidebar';
import { ChatArea } from './chat-area';

export default function AgentChatPage() {
  return (
    <div className="flex h-screen w-full bg-[#111111] overflow-hidden text-foreground">
      <Sidebar />
      <ChatArea />
    </div>
  );
}
