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
    const response = await fetchChatBotStream(latestMessage, "1");

    if (!response.body) {
      return new Response("Empty response from Chat Bot", { status: 500 });
    }

    // The frontend is using TextStreamChatTransport, which renders raw text exactly as received.
    // The Python backend emits Server-Sent Events (SSE) like `data: Hello\n\n`.
    // We must extract just the raw text and stream it to the frontend.
    let buffer = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk, { stream: true });
        
        // Python's SSE yields `data: {content}\n\n`. 
        // We split by \n\n to preserve any internal \n that {content} might contain (like markdown tables).
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';
        
        for (const chunkStr of chunks) {
          if (chunkStr.startsWith('data: ')) {
            const content = chunkStr.slice(6);
            if (content.trim() === '[DONE]') continue;
            
            // Just enqueue the raw text!
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      },
      flush(controller) {
        if (buffer.startsWith('data: ')) {
          const content = buffer.slice(6);
          if (content.trim() !== '[DONE]') {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      }
    });

    return new Response(response.body.pipeThrough(transformStream), {
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
