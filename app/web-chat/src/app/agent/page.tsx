import { Sidebar } from './sidebar';
import { ChatArea } from './chat-area';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

export default function AgentChatPage() {
  return (
    <>
      <Sidebar />
      <SidebarInset className="relative h-[100dvh] overflow-hidden">
        <div className="md:hidden absolute top-4 left-4 z-50">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        </div>
        <ChatArea />
      </SidebarInset>
    </>
  );
}
