export async function fetchChatBotStream(message: string, thread_id: string, token: string | undefined) {
  const gatewayUrl = process.env.CHAT_GATEWAY;
  
  if (!gatewayUrl) {
    throw new Error("CHAT_GATEWAY environment variable is not configured.");
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add the JWT token if available. The API gateway will verify this
  // and then inject the X-User-Id and X-Internal-Secret for Python!
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${gatewayUrl}/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      thread_id,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("GATEWAY REJECTED STREAM REQUEST:", response.status, errorText);
    throw new Error(`Chat API error (${response.status}): ${errorText}`);
  }

  return response;
}

export async function fetchChatHistory(token: string | undefined) {
  const gatewayUrl = process.env.CHAT_GATEWAY;
  
  if (!gatewayUrl) {
    throw new Error("CHAT_GATEWAY environment variable is not configured.");
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${gatewayUrl}/chat/history`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`History API error (${response.status}): ${errorText}`);
  }

  return response;
}
