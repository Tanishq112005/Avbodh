from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent.graph import stream_chat
from avbodh_tools import ApiResponse
from avbodh_tools.utils.ApiError import ApiError
from models.ChatBotRequest import ChatRequest
# Define the FastAPI Router
router = APIRouter(
    prefix="/chat",
    tags=["ChatBot Agent"]
)


@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Streams the chatbot response back to the client using Server-Sent Events (SSE).
    """
    try:
        # stream_chat is a generator, StreamingResponse consumes it and streams to the client
        return StreamingResponse(
            stream_chat(message=request.message, thread_id=request.thread_id),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise ApiError(
            status_code=500,
            message="Failed to stream chat response",
            error=str(e)
        )
