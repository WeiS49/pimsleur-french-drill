import type { Settings, Sentence, Progress } from '../types'

const KEYS = {
  settings: 'pimsleur-settings',
  sentences: 'pimsleur-sentences',
  progress: 'pimsleur-progress',
} as const

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  voiceIdFr: '',
  voiceIdCn: '',
  voiceIdEn: '',
  promptLanguage: 'cn',
  modelId: 'eleven_flash_v2_5',
}

export function loadSettings(): Settings {
  const raw = localStorage.getItem(KEYS.settings)
  if (!raw) return DEFAULT_SETTINGS
  return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings))
}

export function loadSentences(): Sentence[] {
  const raw = localStorage.getItem(KEYS.sentences)
  return raw ? JSON.parse(raw) : []
}

export function saveSentences(sentences: Sentence[]): void {
  localStorage.setItem(KEYS.sentences, JSON.stringify(sentences))
}

export function loadProgress(): Record<number, Progress> {
  const raw = localStorage.getItem(KEYS.progress)
  return raw ? JSON.parse(raw) : {}
}

export function saveProgress(progress: Record<number, Progress>): void {
  localStorage.setItem(KEYS.progress, JSON.stringify(progress))
}
