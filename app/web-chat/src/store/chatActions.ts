import { UIMessage } from 'ai';
import { RecentChat } from './chat.types';

export async function fetchRecentChatsLogic(set: any) {
  try {
    const res = await fetch('/api/chat/history');
    if (!res.ok) return;
    const json = await res.json();
    const formattedChats: RecentChat[] = [];
    const threadsData: Record<string, UIMessage[]> = {};

    for (const [threadId, threadInfo] of Object.entries<any>(
      json.data?.threads || {},
    )) {
      const messages = threadInfo.messages || [];
      const updatedDate = threadInfo.updated_date
        ? new Date(threadInfo.updated_date).getTime()
        : 0;
      let title = 'New Conversation';
      const formattedMessages: UIMessage[] = [];

      if (messages.length > 0) {
        const firstMsg = messages[0].human_response || '';
        title =
          firstMsg.length > 25 ? firstMsg.substring(0, 25) + '...' : firstMsg;
        if (!title.trim()) title = 'New Conversation';

        messages.forEach((msg: any, i: number) => {
          if (msg.human_response)
            formattedMessages.push({
              id: `${threadId}-user-${i}`,
              role: 'user',
              parts: [{ type: 'text', text: msg.human_response }],
            } as any);
          if (msg.ai_response)
            formattedMessages.push({
              id: `${threadId}-ai-${i}`,
              role: 'assistant',
              parts: [{ type: 'text', text: msg.ai_response }],
            } as any);
        });
      }
      formattedChats.push({ id: threadId, title, updatedAt: updatedDate });
      threadsData[threadId] = formattedMessages;
    }
    formattedChats.sort((a, b) => b.updatedAt - a.updatedAt);
    set({ recentChats: formattedChats, threads: threadsData });
  } catch (e) {
    console.error('Failed to fetch recent chats:', e);
  }
}
