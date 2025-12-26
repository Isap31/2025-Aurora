# Claude API Setup Guide

## Step 1: Get Your API Key

1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to "API Keys" in the dashboard
4. Click "Create Key"
5. Copy your API key (it starts with `sk-ant-`)

## Step 2: Add API Key to Environment File

1. Open the `.env` file in your project root: `/Users/caitlinprzywara3/auroraflow/.env`

2. Replace `your_api_key_here` with your actual API key:

```
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-YOUR-ACTUAL-KEY-HERE
```

**Important:** Never commit your `.env` file to git! It should already be in `.gitignore`.

## Step 3: Restart Expo Server

After adding the API key, restart your Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npx expo start
```

Environment variables in Expo require a server restart to take effect.

## Step 4: Test the Feature

1. Open the app in your simulator
2. Go to Dashboard
3. Tap "Budget-Friendly Meals" card
4. Enter a budget (e.g., $50)
5. Optionally enter zip code and household size
6. Tap "Find Meals"

The app will:
- Fetch your recent glucose average from the database
- Call Claude API with personalized prompt
- Display 5 customized meal recommendations with costs and shopping locations

## What Gets Sent to Claude

Example prompt structure:

```
You are a diabetes nutrition advisor. The user has a weekly food budget of $50
and lives in zip code 98101. Their household size is 2 people. Their recent
glucose average is 142 mg/dL.

Based on this information, suggest 5 affordable, diabetes-friendly meals...
```

## Response Format

Claude returns structured meal recommendations:

```
MEAL 1: Grilled Chicken with Roasted Vegetables
Cost: $3.50 per serving
Good for glucose: High protein and fiber help stabilize blood sugar
Where to shop: Aldi

MEAL 2: ...
```

The app parses this and displays it in a clean card format.

## Troubleshooting

### "API key not configured" error
- Make sure you added the key to `.env` file
- Restart Expo server after adding the key
- Check that the key starts with `sk-ant-`

### Network error
- Make sure you have internet connection
- Check that the backend server is running on `localhost:3000`

### No glucose average
- The app works without glucose data, but it's more personalized with it
- Make sure you've logged some glucose readings first

## Cost Estimate

- Model used: Claude 3.5 Sonnet
- Average tokens per request: ~500 tokens
- Cost: ~$0.015 per meal plan request
- Very affordable for occasional use!

## Security Notes

- API key is stored in `.env` file (never committed to git)
- API calls go directly from the app to Anthropic's servers
- No meal data is stored - it's generated fresh each time
- Consider implementing rate limiting for production use
