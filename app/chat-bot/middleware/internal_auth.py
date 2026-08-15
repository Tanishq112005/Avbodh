from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from config.env import settings
import logging

class InternalAuthMiddleware(BaseHTTPMiddleware):
    
    async def dispatch(self, request: Request, call_next):
        # Allow the health check route to bypass internal auth
        if request.url.path == "/health":
            return await call_next(request)

        secret_header = request.headers.get("x-internal-secret")
        
        if not secret_header or secret_header != settings.INTERNAL_API_SECRET:
            logging.warning(f"[Security] Blocked direct access attempt to {request.url.path}")
            return JSONResponse(
                status_code=403,
                content={
                    "success": False,
                    "message": "Forbidden: Direct access is not allowed. All requests must go through the API Gateway."
                }
            )

        return await call_next(request)
