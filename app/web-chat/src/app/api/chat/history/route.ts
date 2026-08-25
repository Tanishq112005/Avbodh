import { fetchChatHistory } from '@/app/agent/chat-api';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    const response = await fetchChatHistory(token);
    const data = await response.json();
    
    const nextResponse = NextResponse.json(data);
    
    const newAccessToken = response.headers.get('x-new-access-token');
    if (newAccessToken) {
      nextResponse.cookies.set({
        name: 'accessToken',
        value: newAccessToken,
        httpOnly: true,
        path: '/',
        sameSite: 'strict'
      });
    }
    
    return nextResponse;
  } catch (error: any) {
    console.error("HISTORY API ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
