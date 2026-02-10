import { cacheKey, getCachedAudio, setCachedAudio } from './audioCache'

const API_BASE = 'https://api.elevenlabs.io/v1'

export interface TTSOptions {
  text: string
  voiceId: string
  apiKey: string
  modelId?: string
  languageCode?: string
}

export async function generateSpeech(options: TTSOptions): Promise<Blob> {
  const { text, voiceId, apiKey, modelId = 'eleven_v3', languageCode } = options

  // Check cache first
  const key = cacheKey(voiceId, text, modelId)
  const cached = await getCachedAudio(key)
  if (cached) return cached

  // Call ElevenLabs API
  const response = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      ...(languageCode && { language_code: languageCode }),
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`)
  }

  const blob = await response.blob()

  // Cache the audio (key already includes modelId)
  await setCachedAudio(key, blob)

  return blob
}

export async function fetchVoices(apiKey: string): Promise<Array<{ voice_id: string; name: string }>> {
  const response = await fetch(`${API_BASE}/voices`, {
    headers: { 'xi-api-key': apiKey },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('401 Unauthorized: Your API key may lack the "Voices Read" permission. Please create a new key with both "Text to Speech" and "Voices Read" enabled.')
    }
    throw new Error(`Failed to fetch voices (${response.status})`)
  }

  const data = await response.json()
  return data.voices.map((v: { voice_id: string; name: string }) => ({
    voice_id: v.voice_id,
    name: v.name,
  }))
}
