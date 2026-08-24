import { create } from 'zustand';

export interface RecentChat {
  id: string;
  title: string;
}

interface ChatState {
  threadId: string;
  hasMessages: boolean;
  recentChats: RecentChat[];
  setHasMessages: (val: boolean) => void;
  addRecentChat: (chat: RecentChat) => void;
  loadChat: (id: string) => void;
  createNewChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threadId: typeof crypto !== 'undefined' ? crypto.randomUUID() : 'default-thread',
  hasMessages: false,
  recentChats: [],
  setHasMessages: (val) => set({ hasMessages: val }),
  addRecentChat: (chat) => set((state) => {
    // Avoid duplicates
    if (state.recentChats.some(c => c.id === chat.id)) return state;
    return { recentChats: [chat, ...state.recentChats] };
  }),
  loadChat: (id) => set({ threadId: id, hasMessages: true }),
  createNewChat: () => {
    const { hasMessages, threadId } = get();
    // If we haven't typed anything yet, just keep the current empty thread
    if (!hasMessages) return;
    set({ threadId: crypto.randomUUID(), hasMessages: false });
  },
}));
