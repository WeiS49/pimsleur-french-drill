import { useCallback, useRef } from 'react'
import { generateSpeech } from '../utils/elevenlabs'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }, [])

  const play = useCallback(async (
    text: string,
    voiceId: string,
    apiKey: string,
    languageCode?: string,
    modelId?: string,
  ): Promise<void> => {
    stop()

    const blob = await generateSpeech({ text, voiceId, apiKey, languageCode, modelId })
    const url = URL.createObjectURL(blob)
    urlRef.current = url

    return new Promise<void>((resolve, reject) => {
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        URL.revokeObjectURL(url)
        urlRef.current = null
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(url)
        urlRef.current = null
        reject(new Error('Audio playback failed'))
      }
      audio.play().catch(reject)
    })
  }, [stop])

  return { play, stop }
}
