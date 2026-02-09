import { useState, useCallback, useRef, useEffect } from 'react'
import type { Sentence, DrillState, Settings } from '../types'
import { useAudioPlayer } from './useAudioPlayer'

function calculateWaitTime(frText: string): number {
  return frText.length * 150 + 2000
}

export function useDrill(sentences: Sentence[], settings: Settings) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [drillState, setDrillState] = useState<DrillState>('idle')
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const { play, stop: stopAudio } = useAudioPlayer()
  const abortRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentSentence = sentences[currentIndex] ?? null

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const sleep = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms)
    })
  }, [])

  const runCountdown = useCallback((durationMs: number): Promise<void> => {
    return new Promise((resolve) => {
      setTotalTime(durationMs)
      setTimeLeft(durationMs)
      const start = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start
        const remaining = Math.max(0, durationMs - elapsed)
        setTimeLeft(remaining)
        if (remaining <= 0) {
          clearTimer()
          resolve()
        }
      }, 50)
    })
  }, [clearTimer])

  const playSequence = useCallback(async (index: number) => {
    if (!settings.apiKey || sentences.length === 0) return
    abortRef.current = false

    const sentence = sentences[index]
    if (!sentence) return

    // Step 1: Show prompt text + play prompt audio (CN or EN)
    setDrillState('prompt')
    try {
      const promptLang = settings.promptLanguage
      const text = promptLang === 'cn' ? sentence.cn : sentence.en
      const voiceId = promptLang === 'cn' ? settings.voiceIdCn : settings.voiceIdEn
      const langCode = promptLang === 'cn' ? 'zh' : 'en'
      if (voiceId) {
        await play(text, voiceId, settings.apiKey, langCode)
      }
    } catch (err) {
      console.error('Prompt audio failed:', err)
    }
    if (abortRef.current) return

    // Step 2: Anticipation phase — "Try to say it in French..."
    setDrillState('anticipation')
    const waitMs = calculateWaitTime(sentence.fr)
    await runCountdown(waitMs)
    if (abortRef.current) return

    // Step 3: Play answer (French audio)
    setDrillState('answer')
    try {
      if (settings.voiceIdFr) {
        await play(sentence.fr, settings.voiceIdFr, settings.apiKey, 'fr')
      }
    } catch (err) {
      console.error('Answer audio failed:', err)
    }
    if (abortRef.current) return

    // Step 4: Brief pause before next sentence
    setDrillState('pause')
    await sleep(2000)
    if (abortRef.current) return

    // Auto-advance
    const nextIndex = index + 1
    if (nextIndex < sentences.length) {
      setCurrentIndex(nextIndex)
      await playSequence(nextIndex)
    } else {
      setDrillState('idle')
    }
  }, [sentences, settings, play, runCountdown, sleep])

  const start = useCallback(() => {
    if (sentences.length === 0) return
    setCurrentIndex(0)
    playSequence(0)
  }, [sentences, playSequence])

  const stop = useCallback(() => {
    abortRef.current = true
    clearTimer()
    stopAudio()
    setDrillState('idle')
    setTimeLeft(0)
  }, [clearTimer, stopAudio])

  const next = useCallback(() => {
    abortRef.current = true
    clearTimer()
    stopAudio()
    const nextIndex = Math.min(currentIndex + 1, sentences.length - 1)
    setCurrentIndex(nextIndex)
    setTimeout(() => playSequence(nextIndex), 100)
  }, [currentIndex, sentences.length, clearTimer, stopAudio, playSequence])

  const prev = useCallback(() => {
    abortRef.current = true
    clearTimer()
    stopAudio()
    const prevIndex = Math.max(currentIndex - 1, 0)
    setCurrentIndex(prevIndex)
    setTimeout(() => playSequence(prevIndex), 100)
  }, [currentIndex, clearTimer, stopAudio, playSequence])

  const replay = useCallback(() => {
    abortRef.current = true
    clearTimer()
    stopAudio()
    setTimeout(() => playSequence(currentIndex), 100)
  }, [currentIndex, clearTimer, stopAudio, playSequence])

  useEffect(() => {
    return () => {
      abortRef.current = true
      clearTimer()
      stopAudio()
    }
  }, [clearTimer, stopAudio])

  return {
    currentSentence,
    currentIndex,
    drillState,
    timeLeft,
    totalTime,
    start,
    stop,
    next,
    prev,
    replay,
    sentenceCount: sentences.length,
  }
}
