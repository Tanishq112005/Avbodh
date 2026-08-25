export async function fetchChatHistory(token: string | undefined) {
  const gatewayUrl = process.env.CHAT_GATEWAY;
  if (!gatewayUrl)
    throw new Error('CHAT_GATEWAY environment variable is not configured.');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${gatewayUrl}/chat/history`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`History API error (${response.status}): ${errorText}`);
  }

  return response;
}
