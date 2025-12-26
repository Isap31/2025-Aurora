# ElevenLabs Aurora Chat Setup Guide

## Overview

Aurora Chat is a voice-based conversational interface that uses ElevenLabs AI agents for natural voice interactions about diabetes management.

## Features

- Voice-based chat with microphone recording
- Real-time audio processing
- Conversation history display
- Microphone permission handling
- Demo mode when API keys are not configured
- Teal accent design matching the app theme

## Step 1: Get Your ElevenLabs API Credentials

### 1.1 Create an ElevenLabs Account
1. Go to https://elevenlabs.io/
2. Sign up or log in to your account
3. Navigate to your profile settings

### 1.2 Get Your API Key
1. Go to https://elevenlabs.io/app/settings/api-keys
2. Click "Create API Key" or copy your existing key
3. Your API key will start with something like `sk_...`

### 1.3 Create a Conversational AI Agent
1. Go to https://elevenlabs.io/app/conversational-ai
2. Click "Create Agent" or select an existing agent
3. Configure your agent:
   - **Name:** Aurora
   - **First Message:** "Hi! I'm Aurora, your diabetes support companion. How can I help you today?"
   - **System Prompt:** Configure the agent to assist with diabetes management, glucose tracking, meal planning, and general health questions
   - **Voice:** Choose a warm, friendly voice
4. Copy the Agent ID from the agent settings

## Step 2: Add Credentials to Environment File

1. Open the `.env` file in your project root: `/Users/caitlinprzywara3/auroraflow/.env`

2. Replace the placeholder values with your actual credentials:

```
EXPO_PUBLIC_ELEVENLABS_API_KEY=sk_your_actual_api_key_here
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

**Important:** Never commit your `.env` file to git! It should already be in `.gitignore`.

## Step 3: Restart Expo Server

After adding the API credentials, restart your Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npx expo start
```

Environment variables in Expo require a server restart to take effect.

## Step 4: Grant Microphone Permissions

### iOS Simulator
1. When you first tap the microphone button, iOS will request permission
2. Tap "Allow" to grant microphone access
3. If you denied it, go to Settings > Privacy > Microphone > Expo Go and enable

### Android Emulator
1. Android will request permission when you tap the microphone button
2. Tap "Allow" to grant microphone access
3. If denied, go to Settings > Apps > Expo > Permissions > Microphone

## Step 5: Test the Feature

1. Open the app in your simulator
2. Go to Dashboard
3. Tap the "Aurora Chat" button (teal button with chat bubble icon)
4. Grant microphone permission when prompted
5. Tap the large teal microphone button to start recording
6. Speak your question (e.g., "What should I eat for breakfast?")
7. Tap the red stop button when done
8. Aurora will process your audio and respond

## How It Works

### Without API Configuration (Demo Mode)
- The app works in demo mode
- When you tap record, it simulates processing
- Shows a placeholder conversation to demonstrate the UI
- No actual API calls are made

### With API Configuration
- Records your voice using expo-av
- Uploads audio to ElevenLabs
- ElevenLabs transcribes your speech
- Your configured AI agent processes the request
- Agent responds with voice and text
- Audio response is played back
- Conversation is displayed in the chat history

## Implementation Details

### Current Status
The Aurora Chat screen is fully implemented with:
- ✅ Voice recording with expo-av
- ✅ Microphone permission handling
- ✅ UI with conversation history
- ✅ Teal accent design
- ✅ Demo mode for testing without API keys
- ⏳ ElevenLabs API integration (placeholder ready)

### Integration Points

The actual ElevenLabs API integration needs to be implemented in:

**File:** `/Users/caitlinprzywara3/auroraflow/src/screens/AuroraScreen.js`
**Function:** `processAudioWithElevenLabs` (line 87)

The function currently has a placeholder that needs to be replaced with actual API calls:

```javascript
// TODO: Implement actual ElevenLabs API call here
// Example structure:
// 1. Upload audio to ElevenLabs
// 2. Get transcription and agent response
// 3. Convert response to speech
// 4. Play audio response
```

### Recommended Implementation Steps

1. **Upload Audio:** Use ElevenLabs API to upload the recorded audio file
2. **Get Transcription:** Receive the transcription of what the user said
3. **Process with Agent:** Your configured AI agent processes the request
4. **Receive Response:** Get both text and audio response
5. **Play Audio:** Use expo-av to play the audio response
6. **Update UI:** Add the conversation to the history

### Example API Call Structure

```javascript
const response = await fetch('https://api.elevenlabs.io/v1/convai/conversation', {
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
  },
  body: formData, // Audio file
});
```

## Troubleshooting

### "Microphone permission required" warning
- Make sure you granted microphone permission in device settings
- Restart the app after changing permissions

### "ElevenLabs API not configured" in demo mode
- This is expected if API keys are not set
- Add your API credentials to `.env` file
- Restart Expo server

### Recording fails
- Check microphone permissions
- Ensure expo-av is properly installed
- Check console logs for detailed error messages

### No audio playback
- Ensure device volume is up
- Check that you have a stable internet connection
- Verify your ElevenLabs agent is configured correctly

## Cost Estimate

- Model: ElevenLabs Conversational AI
- Pricing varies by plan (check https://elevenlabs.io/pricing)
- Typical cost: ~$0.01-0.05 per conversation depending on length
- Free tier available with limited characters/month

## Security Notes

- API credentials are stored in `.env` file (never committed to git)
- Audio recordings are sent to ElevenLabs servers
- No audio is stored locally after processing
- Consider implementing rate limiting for production use
- Review ElevenLabs privacy policy for HIPAA compliance if needed

## Next Steps

1. Configure your ElevenLabs agent with diabetes-specific knowledge
2. Implement the actual API integration in `processAudioWithElevenLabs`
3. Add error handling for network failures
4. Consider adding conversation persistence to database
5. Add ability to replay previous audio responses
6. Implement conversation context passing to agent

## Resources

- ElevenLabs Documentation: https://elevenlabs.io/docs
- ElevenLabs Conversational AI: https://elevenlabs.io/docs/conversational-ai
- expo-av Documentation: https://docs.expo.dev/versions/latest/sdk/av/
