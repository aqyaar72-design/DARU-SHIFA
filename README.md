# DARU-SHIFA ONLINE

Responsive Somali website for Quran/Ruqya online services, Supabase Auth, Telegram access, WhatsApp contact, and LiveKit group audio/video calls.

## Supabase
Browser uses the provided project URL and publishable key. Publishable keys are intended for browser/mobile apps; protect database tables with RLS.

## LiveKit
For real group audio/video calls, create a LiveKit project and set these Vercel Environment Variables:
- LIVEKIT_URL
- LIVEKIT_API_KEY
- LIVEKIT_API_SECRET
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY

Never put LIVEKIT_API_SECRET in browser code.

## Deploy
Vercel: Framework Other, Root Directory project root, no build command needed.
