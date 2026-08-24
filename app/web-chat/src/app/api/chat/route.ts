import { fetchChatBotStream } from '@/app/agent/chat-api';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const lastMsg = messages[messages.length - 1];
    const latestMessage = lastMsg?.content || 
                          lastMsg?.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || 
                          "";

    // Call our custom utility that hits {{CHAT_BOT}}/chat/stream
    const response = await fetchChatBotStream(latestMessage, "4500");

    if (!response.body) {
      return new Response("Empty response from Chat Bot", { status: 500 });
    }

    // The frontend is using TextStreamChatTransport, which renders raw text exactly as received.
    // The Python backend now emits pure text chunks, so we can pipe the stream directly!
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error("API ROUTE ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
