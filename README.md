# Loyalty Design Delta API

FastAPI backend service for loyalty program design workflows.

## Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create .env file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the server:
```bash
python main.py
```

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file with the following:

```env
# API Configuration
OPENAI_API_KEY=your-openai-key-here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,https://your-domain.vercel.app

# Logging Configuration
LOG_LEVEL=INFO

# Environment Type
ENVIRONMENT=development  # development, staging, production
```

## CORS Configuration

The API implements CORS protection. Configure allowed origins in your environment:

1. Local development:
   - Add `http://localhost:3000` to ALLOWED_ORIGINS

2. Production:
   - Add your Vercel deployment URL to ALLOWED_ORIGINS
   - Format: `https://your-app-name.vercel.app`

### Troubleshooting CORS

If you encounter CORS issues:

1. Check the Network tab in browser dev tools
2. Verify the Origin header matches ALLOWED_ORIGINS
3. Use the /debug/cors endpoint to verify configuration

## Error Handling

The API implements comprehensive error handling:

1. All errors include:
   - Error message
   - Error code (when applicable)
   - Correlation ID for tracking

2. Frontend retry logic:
   - Automatically retries failed requests
   - Configurable retry count and delay
   - Handles network errors gracefully

## Logging

The application uses structured logging:

1. Each request has a correlation ID
2. Logs include request/response details
3. Environment-specific log levels

Access logs via:
- Local: Console output
- Railway: Built-in logging interface

## API Documentation

- API Documentation available at `/docs` endpoint
- Swagger UI interface available at `/docs`
- ReDoc interface available at `/redoc`

## Deployment

### Railway Deployment

1. Install Railway CLI
2. Login to Railway: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

### Environment Variables

Set these in Railway dashboard:
- `OPENAI_API_KEY`
- `ALLOWED_ORIGINS`
- `ENVIRONMENT`
- `LOG_LEVEL`

### Vercel Configuration

Set in Vercel project settings:
- `NEXT_PUBLIC_API_URL`: Your Railway API URL

## Development Notes

### Debug Endpoints

- `/healthcheck`: Verify API status
- `/debug/cors`: Debug CORS configuration
- `/test-openai`: Test OpenAI connection

### Error Codes

Common error codes and their meaning:
- `CORS_ERROR`: CORS configuration issue
- `NETWORK_ERROR`: Connection problem
- `API_ERROR`: Backend processing error

### Correlation IDs

All requests include a correlation ID for tracking:
1. Sent in response headers: `X-Correlation-ID`
2. Included in error responses
3. Logged with all related events