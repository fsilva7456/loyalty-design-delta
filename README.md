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

## Railway Deployment

1. Install Railway CLI
2. Login to Railway: `railway login`
3. Link project: `railway link`
4. Deploy: `railway up`

## Development Notes

- API Documentation available at `/docs` endpoint
- Swagger UI interface available at `/docs`
- ReDoc interface available at `/redoc`