import { MessageSquare } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function SidebarHistory({
  recentChats,
  activeThreadId,
  loadChat,
}: {
  recentChats: any[];
  activeThreadId: string;
  loadChat: (id: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {recentChats.length === 0 ? (
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <span className="text-muted-foreground italic pl-2">
                  No recent chats
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            recentChats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => loadChat(chat.id)}
                  isActive={activeThreadId === chat.id}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{chat.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
