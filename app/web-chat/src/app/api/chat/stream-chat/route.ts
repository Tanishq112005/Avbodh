import { handleStreamChat } from './chatService';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    return await handleStreamChat(req);
  } catch (error: any) {
    console.error('API ROUTE ERROR:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
