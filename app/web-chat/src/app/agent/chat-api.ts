export async function fetchChatBotStream(message: string, thread_id: string = "45") {
  const chatBotUrl = process.env.CHAT_BOT;
  
  if (!chatBotUrl) {
    throw new Error("CHAT_BOT environment variable is not configured.");
  }

  const response = await fetch(`${chatBotUrl}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Include the internal secret so the ChatBot allows the request
      // bypassing the API Gateway!
      'x-internal-secret': 'hello',
      // The Python backend strictly requires a user ID header
      'x-user-id': 'test-user-123'
    },
    body: JSON.stringify({
      message,
      thread_id,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API error (${response.status}): ${errorText}`);
  }

  return response;
}
