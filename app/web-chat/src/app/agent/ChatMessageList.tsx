import { UserMessage } from '@/components/user-message';
import { AgentMessage } from '@/components/agent-message';
import { ThinkingIndicator } from '@/components/thinking';

export function ChatMessageList({
  messages,
  status,
  messagesEndRef,
}: {
  messages: any[];
  status: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      {messages.map((message) => {
        const content =
          message.parts
            ?.filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('') || '';
        if (message.role === 'user') {
          return (
            <UserMessage
              key={message.id}
              content={content}
              attachments={message.experimental_attachments}
            />
          );
        }
        return <AgentMessage key={message.id} content={content} />;
      })}

      {messages.length > 0 &&
        messages[messages.length - 1].role === 'user' &&
        (status === 'submitted' || status === 'streaming') && (
          <ThinkingIndicator style="dots" />
        )}
      <div ref={messagesEndRef} />
    </div>
  );
}
