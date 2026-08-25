import { UIMessage } from 'ai';

export interface RecentChat {
  id: string;
  title: string;
  updatedAt: number;
}

export interface ChatState {
  threadId: string;
  hasMessages: boolean;
  recentChats: RecentChat[];
  threads: Record<string, UIMessage[]>;
  setHasMessages: (val: boolean) => void;
  addRecentChat: (chat: RecentChat) => void;
  setRecentChats: (chats: RecentChat[]) => void;
  fetchRecentChats: () => Promise<void>;
  loadChat: (id: string) => void;
  createNewChat: () => void;
}
