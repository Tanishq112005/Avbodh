import { fetchChatHistory } from '@/app/agent/chat-api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await fetchChatHistory();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("HISTORY API ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch history" },
      { status: 500 }
    );
  }
}
