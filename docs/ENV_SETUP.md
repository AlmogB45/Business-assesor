# Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3001
```

## Setup Instructions

### 1. Get Google Gemini API Key (FREE!)
1. Visit https://ai.google.dev/
2. Click "Get API key in Google AI Studio"
3. Sign in with your Google account
4. Click "Create API key"
5. Copy the generated key

**Free Tier Includes:**
- 15 requests per minute
- 1 million tokens per month
- No billing required!

### 2. Create Environment File
```bash
cd backend
touch .env  # Linux/Mac
# OR
echo. > .env  # Windows CMD
```

### 3. Add Configuration
Edit `backend/.env` and add:
```env
GEMINI_API_KEY=your_actual_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3001
```

### 4. Verify Setup
```bash
cd backend
npm run dev
```

You should see:
```
- GEMINI_API_KEY: ✅ Set
✅ Loaded 20 requirements
Backend server running on port 3001
```

## Troubleshooting

### Error: "GEMINI_API_KEY is not set"
- Verify `.env` file exists in `backend/` directory
- Ensure `GEMINI_API_KEY` is set correctly
- Restart the backend server after changes

### Error: "API_KEY_INVALID"
- Invalid Gemini API key
- Generate a new key at https://ai.google.dev/
- Ensure you copied the full key

### Error: "QUOTA_EXCEEDED"
- You've exceeded the free tier limits
- Wait until next month for quota reset
- Upgrade to paid plan if needed

### Falls Back to Mock Reports
- App works even without valid API key
- Mock reports are professional and functional
- Add valid key for AI-generated custom reports

## Security Notes

- ✅ `.env` files are in `.gitignore` (never commit API keys)
- ✅ Google Gemini has generous free tier
- ✅ No billing setup required for free tier
- ✅ Monitor usage at https://ai.google.dev/
