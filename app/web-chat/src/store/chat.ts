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
  setRecentChats: (chats: RecentChat[]) => void;
  fetchRecentChats: () => Promise<void>;
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
  setRecentChats: (chats) => set({ recentChats: chats }),
  fetchRecentChats: async () => {
    try {
      const res = await fetch('/api/chat/history');
      if (res.ok) {
        const json = await res.json();
        // Assume json.data is a list of chat objects from Python
        if (json.data && Array.isArray(json.data)) {
          // Map backend format to frontend RecentChat format
          const formattedChats = json.data.map((chat: any) => ({
            id: chat.thread_id || chat.id || chat._id,
            title: chat.title || 'Previous Conversation'
          })).filter((c: any) => c.id);
          
          set({ recentChats: formattedChats });
        }
      }
    } catch (e) {
      console.error("Failed to fetch recent chats:", e);
    }
  },
  loadChat: (id) => set({ threadId: id, hasMessages: true }),
  createNewChat: () => {
    const { hasMessages, threadId } = get();
    // If we haven't typed anything yet, just keep the current empty thread
    if (!hasMessages) return;
    set({ threadId: crypto.randomUUID(), hasMessages: false });
  },
}));
