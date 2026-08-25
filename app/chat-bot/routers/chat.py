from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from agent.graph import stream_chat
from avbodh_tools import ApiResponse
from avbodh_tools.utils.ApiError import ApiError
from schemas.chat import ChatRequest
from services.chat_history import ChatHistoryService

# Define the FastAPI Router
router = APIRouter(
    prefix="/chat",
    tags=["ChatBot Agent"]
)

@router.get("/history")
async def get_chat_history(
    x_user_id: str = Header(..., description="The unique ID of the user")
):

    try:
        history = await ChatHistoryService.get_synchronized_history(x_user_id)
      
        return ApiResponse(
            message="Successfully retrieved synchronized chat history",
            data=history
        )
    except Exception as e:
  
        raise ApiError(
            message="Failed to retrieve chat history",
            errors={"detail": str(e)}
        )

@router.post("/stream")
async def chat_stream_endpoint(
    request: ChatRequest,
    x_user_id: str = Header(..., description="The unique ID of the user"),
):
   
    try:
        # stream_chat is a generator, StreamingResponse consumes it and streams to the client
        return StreamingResponse(
            stream_chat(message=request.message, thread_id=request.thread_id, user_id=x_user_id),
            media_type="text/plain"
        )
    except Exception as e:
        raise ApiError(
            message="Failed to stream chat response",
            errors={"detail": str(e)}
        )
