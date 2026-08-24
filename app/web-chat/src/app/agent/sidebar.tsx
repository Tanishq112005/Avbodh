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
export function Sidebar() {
  return (
    
    <SidebarPrimitive variant="sidebar" collapsible="icon" className="bg-[#111111] border-r border-white/10">
      <SidebarHeader className="pt-4 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarTrigger className="ml-0.5 text-muted-foreground hover:text-foreground" />
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-2">
            <SidebarMenuButton tooltip="New Chat" className="font-medium">
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
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessageSquare className="w-4 h-4" />
                  <span>Design chat layout...</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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