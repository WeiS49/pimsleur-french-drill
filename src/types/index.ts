export interface Sentence {
  id: number
  fr: string
  cn: string
  en: string
  phonetic?: string
  notes?: string
  lesson?: number
  difficulty?: number
}

export interface Progress {
  sentenceId: number
  reviewCount: number
  lastReviewAt: number
  nextReviewAt: number
  ease: number
}

export interface AudioCacheEntry {
  key: string
  blob: Blob
  createdAt: number
}

export interface Settings {
  apiKey: string
  voiceIdFr: string
  voiceIdCn: string
  voiceIdEn: string
  promptLanguage: 'cn' | 'en'
  modelId: string
}

export type DrillState = 'idle' | 'prompt' | 'anticipation' | 'answer' | 'pause'
