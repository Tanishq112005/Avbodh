'use client';

import { Plus, MessageSquare, User2 } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useChatStore } from '@/store/chat';

export function Sidebar() {
  const createNewChat = useChatStore((s) => s.createNewChat);

  return (
    
    <SidebarPrimitive variant="sidebar" collapsible="icon" className="bg-[#111111] border-r border-white/10">
      <SidebarHeader className="pt-4 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="ml-0.5 text-muted-foreground hover:text-foreground" />
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton 
              onClick={createNewChat} 
              tooltip="New Chat" 
              className="font-medium hover:bg-white/10 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {useChatStore((s) => s.recentChats).length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <span className="text-muted-foreground italic pl-2">No recent chats</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                useChatStore((s) => s.recentChats).map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton 
                      onClick={() => useChatStore.getState().loadChat(chat.id)}
                      isActive={useChatStore((s) => s.threadId) === chat.id}
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="User Options">
              <User2 className="w-4 h-4" />
              <span>User Options</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}