import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message } from 'ai';

export interface RecentChat {
  id: string;
  title: string;
  updatedAt: number;
}

interface ChatState {
  threadId: string;
  hasMessages: boolean;
  recentChats: RecentChat[];
  threads: Record<string, Message[]>;
  setHasMessages: (val: boolean) => void;
  addRecentChat: (chat: RecentChat) => void;
  setRecentChats: (chats: RecentChat[]) => void;
  fetchRecentChats: () => Promise<void>;
  loadChat: (id: string) => void;
  createNewChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      threadId: typeof crypto !== 'undefined' ? crypto.randomUUID() : 'default-thread',
      hasMessages: false,
      recentChats: [],
      threads: {},
      setHasMessages: (val) => set({ hasMessages: val }),
      addRecentChat: (chat) => set((state) => {
        if (state.recentChats.some(c => c.id === chat.id)) return state;
        return { recentChats: [chat, ...state.recentChats] };
      }),
      setRecentChats: (chats) => set({ recentChats: chats }),
      fetchRecentChats: async () => {
        try {
          const res = await fetch('/api/chat/history');
          if (res.ok) {
            const json = await res.json();
            const threadsDict = json.data?.threads || {};
            
            const formattedChats: RecentChat[] = [];
            const threadsData: Record<string, Message[]> = {};

            for (const [threadId, threadInfo] of Object.entries<any>(threadsDict)) {
              const messages = threadInfo.messages || [];
              const updatedDate = threadInfo.updated_date ? new Date(threadInfo.updated_date).getTime() : 0;
              
              let title = "New Conversation";
              const formattedMessages: Message[] = [];
              
              if (messages.length > 0) {
                const firstMsg = messages[0].human_response || "";
                title = firstMsg.length > 25 ? firstMsg.substring(0, 25) + '...' : firstMsg;
                if (!title.trim()) title = "New Conversation";
                
                // Format messages for the AI SDK v4
                messages.forEach((msg: any, i: number) => {
                  if (msg.human_response) {
                    formattedMessages.push({
                      id: `${threadId}-user-${i}`,
                      role: 'user',
                      parts: [{ type: 'text', text: msg.human_response }]
                    } as any);
                  }
                  if (msg.ai_response) {
                    formattedMessages.push({
                      id: `${threadId}-ai-${i}`,
                      role: 'assistant',
                      parts: [{ type: 'text', text: msg.ai_response }]
                    } as any);
                  }
                });
              }
              
              formattedChats.push({
                id: threadId,
                title,
                updatedAt: updatedDate
              });
              
              threadsData[threadId] = formattedMessages;
            }

            // Sort by updated_date descending
            formattedChats.sort((a, b) => b.updatedAt - a.updatedAt);
            
            set({ recentChats: formattedChats, threads: threadsData });
          }
        } catch (e) {
          console.error("Failed to fetch recent chats:", e);
        }
      },
      loadChat: (id) => set({ threadId: id, hasMessages: true }),
      createNewChat: () => {
        const { hasMessages } = get();
        if (!hasMessages) return;
        set({ threadId: crypto.randomUUID(), hasMessages: false });
      },
    }),
    {
      name: 'chat-storage', // unique name for localStorage key
      partialize: (state) => ({
        threadId: state.threadId,
        hasMessages: state.hasMessages,
        recentChats: state.recentChats,
        threads: state.threads
      }), // only persist these fields
    }
  )
);
