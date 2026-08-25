export async function fetchChatBotStream(
  message: string,
  thread_id: string,
  token: string | undefined,
  refreshToken?: string | undefined,
) {
  const gatewayUrl = process.env.CHAT_GATEWAY;
  if (!gatewayUrl)
    throw new Error('CHAT_GATEWAY environment variable is not configured.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (refreshToken) headers['x-refresh-token'] = refreshToken;

  const response = await fetch(`${gatewayUrl}/chat/stream`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ message, thread_id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API error (${response.status}): ${errorText}`);
  }

  return response;
}
