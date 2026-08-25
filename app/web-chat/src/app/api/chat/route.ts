import { fetchChatBotStream } from '@/app/agent/chat-api';
import { cookies } from 'next/headers';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('thread_id') || '450015';

    // Get the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    console.log("=== NEXT.JS API STREAM ===");
    console.log("Thread ID:", threadId);
    console.log("Has Token?:", !!token);

    const { messages } = await req.json();
    
    const lastMsg = messages[messages.length - 1];
    const latestMessage = lastMsg?.content || 
                          lastMsg?.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || 
                          "";

    // Call our custom utility that hits {{CHAT_GATEWAY}}/chat/stream
    const response = await fetchChatBotStream(latestMessage, threadId, token);

    if (!response.body) {
      return new Response("Empty response from Chat Bot", { status: 500 });
    }

    // Check if the API Gateway refreshed our token behind the scenes
    const newAccessToken = response.headers.get('x-new-access-token');

    const headers = new Headers({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    if (newAccessToken) {
      // Set the new token as an HttpOnly cookie so the browser saves it
      headers.set('Set-Cookie', `accessToken=${newAccessToken}; Path=/; HttpOnly; SameSite=Strict`);
    }

    return new Response(response.body, { headers });
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
