import { Plus } from 'lucide-react';
import {
  SidebarHeader as Header,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function SidebarHeader({
  createNewChat,
}: {
  createNewChat: () => void;
}) {
  return (
    <Header className="pt-4 pb-0">
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
    </Header>
  );
}
