import { useState, useEffect } from 'react'
import type { Settings } from '../types'
import { fetchVoices } from '../utils/elevenlabs'

interface SettingsViewProps {
  settings: Settings
  onSave: (settings: Settings) => void
}

export function SettingsView({ settings, onSave }: SettingsViewProps) {
  const [form, setForm] = useState<Settings>(settings)
  const [voices, setVoices] = useState<Array<{ voice_id: string; name: string }>>([])
  const [loadingVoices, setLoadingVoices] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(settings)
  }, [settings])

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
  }

  const handleSave = () => {
    onSave(form)
  }

  return (
    <div className="w-full max-w-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Settings</h2>

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

      {/* Load Voices Button */}
      <button
        onClick={handleLoadVoices}
        disabled={loadingVoices || !form.apiKey}
        className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-30 text-white text-sm transition-colors"
      >
        {loadingVoices ? 'Loading...' : 'Load Voices'}
      </button>

      {error && <p className="text-danger text-sm">{error}</p>}

      {/* Voice selections */}
      {voices.length > 0 && (
        <div className="space-y-4">
          <VoiceSelect
            label="French Voice"
            value={form.voiceIdFr}
            voices={voices}
            onChange={(v) => update('voiceIdFr', v)}
          />
          <VoiceSelect
            label="Chinese Voice"
            value={form.voiceIdCn}
            voices={voices}
            onChange={(v) => update('voiceIdCn', v)}
          />
          <VoiceSelect
            label="English Voice"
            value={form.voiceIdEn}
            voices={voices}
            onChange={(v) => update('voiceIdEn', v)}
          />
        </div>
      )}

      {/* Manual voice ID inputs (always shown as fallback) */}
      {voices.length === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm text-text-secondary">French Voice ID</label>
            <input
              type="text"
              value={form.voiceIdFr}
              onChange={(e) => update('voiceIdFr', e.target.value)}
              placeholder="Voice ID for French"
              className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-text-secondary">Chinese Voice ID</label>
            <input
              type="text"
              value={form.voiceIdCn}
              onChange={(e) => update('voiceIdCn', e.target.value)}
              placeholder="Voice ID for Chinese"
              className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-text-secondary">English Voice ID</label>
            <input
              type="text"
              value={form.voiceIdEn}
              onChange={(e) => update('voiceIdEn', e.target.value)}
              placeholder="Voice ID for English"
              className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none"
            />
          </div>
        </div>
      )}

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
        className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors active:scale-[0.98]"
      >
        Save Settings
      </button>
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
