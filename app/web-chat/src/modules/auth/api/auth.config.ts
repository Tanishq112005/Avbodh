export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/auth';

export async function fetchApi(endpoint: string, options: RequestInit) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || result.error || 'API Request Failed');
  return result;
}
