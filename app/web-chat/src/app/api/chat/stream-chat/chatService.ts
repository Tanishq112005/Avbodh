import { fetchChatBotStream } from '@/app/agent/chat-api';
import { cookies } from 'next/headers';

export async function handleStreamChat(req: Request) {
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get('thread_id') || '450015';
  const token = (await cookies()).get('accessToken')?.value;

  const { messages } = await req.json();
  const lastMsg = messages[messages.length - 1];
  const latestMessage =
    lastMsg?.content ||
    lastMsg?.parts
      ?.filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('') ||
    '';

  const response = await fetchChatBotStream(latestMessage, threadId, token);
  if (!response.body) return new Response('Empty response', { status: 500 });

  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const newToken = response.headers.get('x-new-access-token');
  if (newToken)
    headers.set(
      'Set-Cookie',
      `accessToken=${newToken}; Path=/; HttpOnly; SameSite=Strict`,
    );

  return new Response(response.body, { headers });
}
