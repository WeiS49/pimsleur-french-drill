# Pimsleur French Drill

Audio-first French training web app based on the Pimsleur method. Uses ElevenLabs TTS with IndexedDB caching for cost-effective, high-quality audio generation.

## Features

- **Drill Mode**: CN/EN prompt -> anticipation phase ("Try to say it in French...") -> shrinking time bar -> FR answer -> auto-advance
- **Tri-lingual TTS**: French, Chinese, and English audio via ElevenLabs API
- **Audio Caching**: IndexedDB cache means you only pay for API calls once per sentence
- **JSON Import/Export**: Manage sentence data with simple JSON format
- **Dark Theme**: Tactical minimalist design with large touch targets
- **PWA Ready**: Service Worker for offline static assets

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- ElevenLabs API (Flash v2.5)
- IndexedDB (audio cache) + localStorage (settings/progress)

## Getting Started

```bash
npm install
npm run dev
```

1. Go to **Settings** and enter your ElevenLabs API key
2. Click **Load Voices** and select voices for French, Chinese, and English
3. Go to **Sentences** and import JSON data:

```json
[
  { "id": 1, "fr": "Bonjour", "cn": "你好", "en": "Hello" },
  { "id": 2, "fr": "J'habite à Puteaux", "cn": "我住在Puteaux", "en": "I live in Puteaux" }
]
```

4. Go to **Drill** and hit START

## Sentence JSON Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | yes | Unique identifier |
| `fr` | string | yes | French text |
| `cn` | string | yes | Chinese translation |
| `en` | string | yes | English translation |
| `phonetic` | string | no | IPA phonetic notation |
| `notes` | string | no | Grammar/pronunciation notes |
| `lesson` | number | no | Lesson group number |
| `difficulty` | number | no | Difficulty level (1-5) |

## API Cost

With audio caching, costs are one-time:

| Sentences | Approx. Cost |
|-----------|-------------|
| 300 | Free (Free tier) |
| 1,000 | ~$5 (Starter, 1 month) |
| 2,000 | ~$22 (Creator, 1 month) |

## Roadmap

- [ ] Spaced repetition scheduler (Pimsleur graduated interval recall)
- [ ] 30-minute structured lesson sessions
- [ ] Capacitor iOS wrapper for background audio playback
- [ ] Pronunciation hints (IPA display)
- [ ] Learning statistics dashboard

## License

MIT
