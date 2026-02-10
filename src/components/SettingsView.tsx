import { useState, useEffect } from 'react'
import type { Settings } from '../types'
import { fetchVoices } from '../utils/elevenlabs'
import { clearAudioCache, getCacheSize } from '../utils/audioCache'
import { RECOMMENDED_VOICES } from '../utils/voices'

interface SettingsViewProps {
  settings: Settings
  onSave: (settings: Settings) => void
}

export function SettingsView({ settings, onSave }: SettingsViewProps) {
  const [form, setForm] = useState<Settings>(settings)
  const [voices, setVoices] = useState<Array<{ voice_id: string; name: string }>>([])
  const [loadingVoices, setLoadingVoices] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [guideOpen, setGuideOpen] = useState(!settings.apiKey)
  const [cacheCount, setCacheCount] = useState(0)
  const [cacheCleared, setCacheCleared] = useState(false)

  useEffect(() => {
    setForm(settings)
  }, [settings])

  useEffect(() => {
    getCacheSize().then(setCacheCount).catch(() => {})
  }, [])

  const handleLoadVoices = async () => {
    if (!form.apiKey) {
      setError('Please enter an API key first')
      return
    }
    setLoadingVoices(true)
    setError('')
    try {
      const v = await fetchVoices(form.apiKey)
      setVoices(v)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load voices')
    } finally {
      setLoadingVoices(false)
    }
  }

  const update = (key: keyof Settings, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const applyRecommended = () => {
    setForm((prev) => ({
      ...prev,
      voiceIdFr: RECOMMENDED_VOICES.fr[0].id,
      voiceIdCn: RECOMMENDED_VOICES.cn[0].id,
      voiceIdEn: RECOMMENDED_VOICES.en[0].id,
    }))
    setSaved(false)
  }

  return (
    <div className="w-full max-w-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Settings</h2>

      {/* Quick Start Guide */}
      <div className="rounded-xl border border-accent/30 overflow-hidden">
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full px-4 py-3 flex justify-between items-center bg-accent/10 text-text-primary text-sm font-medium"
        >
          Quick Start Guide
          <span className="text-text-muted">{guideOpen ? '\u25B2' : '\u25BC'}</span>
        </button>
        {guideOpen && (
          <div className="px-4 py-4 space-y-3 text-sm text-text-secondary">
            <Step n={1}>
              <a
                href="https://elevenlabs.io/app/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline"
              >
                Sign up at ElevenLabs
              </a>
              {' '} (free, no credit card needed)
            </Step>
            <Step n={2}>
              Dashboard &rarr; <strong>Developers</strong> &rarr; <strong>API Keys</strong> &rarr; Create.{' '}
              Enable <strong>Text to Speech</strong> + <strong>Voices Read</strong> permissions
            </Step>
            <Step n={3}>
              Paste your API Key below
            </Step>
            <Step n={4}>
              Click <strong>"Use Recommended Voices"</strong> or Load Voices to choose your own.{' '}
              Browse the{' '}
              <a
                href="https://elevenlabs.io/voice-library"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline"
              >
                Voice Library
              </a>
              {' '}for native-speaker voices
            </Step>
            <Step n={5}>
              Click <strong>Save Settings</strong>, then go to <strong>Sentences</strong> to load data, then <strong>Drill</strong> to start!
            </Step>
          </div>
        )}
      </div>

      {/* API Key */}
      <div className="space-y-2">
        <label className="block text-sm text-text-secondary">ElevenLabs API Key</label>
        <input
          type="password"
          value={form.apiKey}
          onChange={(e) => update('apiKey', e.target.value)}
          placeholder="xi-..."
          className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
        />
      </div>

      {/* Voice configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-text-secondary font-medium">Voices</label>
          <div className="flex gap-2">
            <button
              onClick={applyRecommended}
              className="px-3 py-1.5 rounded-lg bg-success/20 hover:bg-success/30 text-success text-xs font-medium transition-colors"
            >
              Use Recommended
            </button>
            <button
              onClick={handleLoadVoices}
              disabled={loadingVoices || !form.apiKey}
              className="px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 disabled:opacity-30 text-accent text-xs font-medium transition-colors"
            >
              {loadingVoices ? 'Loading...' : 'Load All Voices'}
            </button>
          </div>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        {/* Voice selections — dropdown if voices loaded, input otherwise */}
        {voices.length > 0 ? (
          <>
            <VoiceSelect label="French Voice" value={form.voiceIdFr} voices={voices} onChange={(v) => update('voiceIdFr', v)} />
            <VoiceSelect label="Chinese Voice" value={form.voiceIdCn} voices={voices} onChange={(v) => update('voiceIdCn', v)} />
            <VoiceSelect label="English Voice" value={form.voiceIdEn} voices={voices} onChange={(v) => update('voiceIdEn', v)} />
          </>
        ) : (
          <>
            <VoiceInput label="French Voice" value={form.voiceIdFr} recommended={RECOMMENDED_VOICES.fr} onChange={(v) => update('voiceIdFr', v)} />
            <VoiceInput label="Chinese Voice" value={form.voiceIdCn} recommended={RECOMMENDED_VOICES.cn} onChange={(v) => update('voiceIdCn', v)} />
            <VoiceInput label="English Voice" value={form.voiceIdEn} recommended={RECOMMENDED_VOICES.en} onChange={(v) => update('voiceIdEn', v)} />
          </>
        )}
      </div>

      {/* Prompt Language */}
      <div className="space-y-2">
        <label className="block text-sm text-text-secondary">Prompt Language</label>
        <select
          value={form.promptLanguage}
          onChange={(e) => update('promptLanguage', e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
        >
          <option value="cn">Chinese (default)</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-lg font-medium transition-colors active:scale-[0.98] ${
          saved
            ? 'bg-success text-white'
            : 'bg-accent hover:bg-accent-hover text-white'
        }`}
      >
        {saved ? 'Saved!' : 'Save Settings'}
      </button>

      {/* Clear Audio Cache */}
      <button
        onClick={async () => {
          await clearAudioCache()
          setCacheCount(0)
          setCacheCleared(true)
          setTimeout(() => setCacheCleared(false), 2000)
        }}
        className={`w-full py-3 rounded-lg font-medium transition-colors active:scale-[0.98] ${
          cacheCleared
            ? 'bg-success text-white'
            : 'bg-bg-card hover:bg-bg-card/80 text-text-secondary border border-bg-card'
        }`}
      >
        {cacheCleared ? 'Cache Cleared!' : `Clear Audio Cache (${cacheCount} items)`}
      </button>
    </div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">
        {n}
      </span>
      <span>{children}</span>
    </div>
  )
}

function VoiceSelect({
  label,
  value,
  voices,
  onChange,
}: {
  label: string
  value: string
  voices: Array<{ voice_id: string; name: string }>
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-text-secondary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
      >
        <option value="">Select a voice...</option>
        {voices.map((v) => (
          <option key={v.voice_id} value={v.voice_id}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function VoiceInput({
  label,
  value,
  recommended,
  onChange,
}: {
  label: string
  value: string
  recommended: ReadonlyArray<{ id: string; name: string }>
  onChange: (v: string) => void
}) {
  const isRecommended = recommended.some((r) => r.id === value)
  return (
    <div className="space-y-2">
      <label className="block text-sm text-text-secondary">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Voice ID"
        className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
      />
      <div className="flex gap-2 flex-wrap">
        {recommended.map((r) => (
          <button
            key={r.id}
            onClick={() => onChange(r.id)}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              value === r.id
                ? 'bg-accent text-white'
                : 'bg-bg-card text-text-muted hover:text-text-secondary'
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>
      {isRecommended && (
        <p className="text-xs text-success">Using recommended voice</p>
      )}
    </div>
  )
}
