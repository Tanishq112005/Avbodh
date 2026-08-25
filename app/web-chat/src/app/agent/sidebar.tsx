'use client';

import { User2 } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useChatStore } from '@/store/chat';
import { useEffect } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarHistory } from './SidebarHistory';

export function Sidebar() {
  const createNewChat = useChatStore((s) => s.createNewChat);
  const fetchRecentChats = useChatStore((s) => s.fetchRecentChats);
  const recentChats = useChatStore((s) => s.recentChats);
  const activeThreadId = useChatStore((s) => s.threadId);
  const loadChat = useChatStore((s) => s.loadChat);

  useEffect(() => {
    fetchRecentChats();
  }, [fetchRecentChats]);

  return (
    <SidebarPrimitive
      variant="sidebar"
      collapsible="icon"
      className="bg-[#111111] border-r border-white/10"
    >
      <SidebarHeader createNewChat={createNewChat} />

      <SidebarContent>
        <SidebarHistory
          recentChats={recentChats}
          activeThreadId={activeThreadId}
          loadChat={loadChat}
        />
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
