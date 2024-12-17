import logging
import sys
import json
from datetime import datetime
from typing import Any, Dict
from fastapi import Request

class RequestContextFilter(logging.Filter):
    def __init__(self):
        super().__init__()
        self.request_id = None
        self.correlation_id = None

    def filter(self, record):
        record.request_id = getattr(self, 'request_id', None)
        record.correlation_id = getattr(self, 'correlation_id', None)
        return True

def setup_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(correlation_id)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    logging.getLogger().addFilter(RequestContextFilter())

def log_request_details(request: Request, logger: logging.Logger) -> None:
    headers = dict(request.headers.items())
    # Remove sensitive headers
    if 'authorization' in headers:
        headers['authorization'] = '***'

    logger.info(
        'Request details',
        extra={
            'request_method': request.method,
            'request_url': str(request.url),
            'request_headers': headers,
            'request_client_host': request.client.host if request.client else None,
        }
    )

def format_log_message(message: str, extra: Dict[str, Any] = None) -> str:
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'message': message
    }
    if extra:
        log_entry.update(extra)
    return json.dumps(log_entry)
