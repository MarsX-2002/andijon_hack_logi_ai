# ElevenLabs Integration - Setup Guide

## ✅ Installation Complete
The `elevenlabs` package is installed and ready to use.

## 🔑 Add Your API Key

Open `.env.local` and add:
```bash
ELEVENLABS_API_KEY=your_key_here
```

(Keep your existing `OPENAI_API_KEY` as well)

## 🎯 How It Works

### Architecture:
```
User speaks → AI responds with text → 
Frontend calls `/api/tts` → 
Backend calls ElevenLabs → 
Returns audio as base64 → 
Frontend plays audio
```

### Voice Selection:
The system automatically chooses voices based on language:
- **English**: Adam (natural male voice)
- **Russian**: Sam (Russian-native voice)  
- **Uzbek**: Falls back to English voice (ElevenLabs processes any language)

### Fallback Safety:
If ElevenLabs fails (no API key, quota exceeded, network error), it automatically falls back to browser TTS - your app won't break!

## 🎤 Quality Comparison

**Before (Browser TTS)**:
- Quality: Robotic, mechanical
- Latency: Instant
- Cost: Free

**After (ElevenLabs)**:
- Quality: ✨ Near-human, emotional, natural
- Latency: ~1-2 seconds
- Cost: Free tier = 10,000 chars/month (~30-50 calls)

## 📊 Usage Tracking

Your API key has "History: Read" permission, so you can monitor usage at:
https://elevenlabs.io/usage

## 🚀 Testing

1. Restart your dev server
2. Go to http://localhost:3003/dashboard
3. Click "AI Negotiate"
4. Listen - the AI voice should now sound MUCH more human!

## 🔧 Customization

Want different voices? Check available voices:
https://elevenlabs.io/voice-library

Update voice IDs in `/api/tts/route.ts`:
```typescript
const voiceIds = {
    'en-US': 'your-chosen-voice-id',
    'ru-RU': 'your-russian-voice-id',
    'uz-UZ': 'your-uzbek-voice-id',
}
```

## ⚠️ Free Tier Limits

- **10,000 characters/month**
- Average AI response: ~200 characters
- **You can do ~50 negotiation calls/month for free**
- After that: $5/month for 30K chars

Perfect for your hackathon demo! 🎉
