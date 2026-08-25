import { fetchChatHistory } from '@/app/agent/chat-api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const response = await fetchChatHistory(token, refreshToken);
    const nextResponse = NextResponse.json(await response.json());

    const newToken = response.headers.get('x-new-access-token');
    if (newToken) {
      nextResponse.cookies.set({
        name: 'accessToken',
        value: newToken,
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error('HISTORY API ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 },
    );
  }
}
