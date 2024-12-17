from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging
from typing import Union, Optional
import traceback
import uuid

logger = logging.getLogger(__name__)

class APIError(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: Optional[str] = None,
        internal_message: Optional[str] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.internal_message = internal_message

async def error_handler(request: Request, call_next):
    correlation_id = str(uuid.uuid4())
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        logger.error(
            f"Error processing request: {str(exc)}",
            extra={
                "correlation_id": correlation_id,
                "traceback": traceback.format_exc()
            }
        )

        status_code = 500
        error_detail = "Internal server error"
        error_code = None

        if isinstance(exc, APIError):
            status_code = exc.status_code
            error_detail = exc.detail
            error_code = exc.error_code
        elif isinstance(exc, HTTPException):
            status_code = exc.status_code
            error_detail = exc.detail

        return JSONResponse(
            status_code=status_code,
            content={
                "error": {
                    "detail": error_detail,
                    "code": error_code,
                    "correlation_id": correlation_id
                }
            }
        )
