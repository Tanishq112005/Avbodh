import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState } from './chat.types';
import { fetchRecentChatsLogic } from './chatActions';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threadId:
        typeof crypto !== 'undefined' ? crypto.randomUUID() : 'default-thread',
      hasMessages: false,
      recentChats: [],
      threads: {},
      setHasMessages: (val) => set({ hasMessages: val }),
      addRecentChat: (chat) =>
        set((state) => ({
          recentChats: state.recentChats.some((c) => c.id === chat.id)
            ? state.recentChats
            : [chat, ...state.recentChats],
        })),
      setRecentChats: (chats) => set({ recentChats: chats }),
      fetchRecentChats: () => fetchRecentChatsLogic(set),
      loadChat: (id) => set({ threadId: id, hasMessages: true }),
      createNewChat: () => {
        if (!get().hasMessages) return;
        set({ threadId: crypto.randomUUID(), hasMessages: false });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        threadId: state.threadId,
        hasMessages: state.hasMessages,
        recentChats: state.recentChats,
        threads: state.threads,
      }),
    },
  ),
);
