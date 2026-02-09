import { useState } from 'react'
import type { Sentence } from '../types'

interface SentenceManagerProps {
  sentences: Sentence[]
  onSave: (sentences: Sentence[]) => void
}

const SAMPLE_JSON = `[
  { "id": 1, "fr": "Bonjour", "cn": "你好", "en": "Hello" },
  { "id": 2, "fr": "J'habite à Puteaux", "cn": "我住在Puteaux", "en": "I live in Puteaux" },
  { "id": 3, "fr": "Comment allez-vous ?", "cn": "你好吗？", "en": "How are you?" }
]`

export function SentenceManager({ sentences, onSave }: SentenceManagerProps) {
  const [jsonInput, setJsonInput] = useState('')
  const [error, setError] = useState('')

  const handleImport = () => {
    setError('')
    try {
      const parsed = JSON.parse(jsonInput)
      if (!Array.isArray(parsed)) {
        setError('JSON must be an array')
        return
      }
      const validated: Sentence[] = parsed.map((item: Record<string, unknown>, i: number) => ({
        id: (item.id as number) ?? i + 1,
        fr: String(item.fr ?? ''),
        cn: String(item.cn ?? ''),
        en: String(item.en ?? item.cn ?? ''),
        phonetic: item.phonetic ? String(item.phonetic) : undefined,
        notes: item.notes ? String(item.notes) : undefined,
        lesson: item.lesson ? Number(item.lesson) : undefined,
        difficulty: item.difficulty ? Number(item.difficulty) : undefined,
      }))
      onSave(validated)
      setJsonInput('')
    } catch {
      setError('Invalid JSON format')
    }
  }

  const handleExport = () => {
    const json = JSON.stringify(sentences, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pimsleur-sentences.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: number) => {
    onSave(sentences.filter((s) => s.id !== id))
  }

  return (
    <div className="w-full max-w-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Sentences</h2>

      {/* Current sentences list */}
      {sentences.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-text-secondary">{sentences.length} sentences loaded</p>
            <button
              onClick={handleExport}
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Export JSON
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {sentences.map((s) => (
              <div key={s.id} className="bg-bg-card rounded-lg p-3 flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm truncate">{s.fr}</p>
                  <p className="text-text-muted text-xs truncate">{s.cn}</p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-text-muted hover:text-danger text-sm shrink-0 transition-colors"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON Import */}
      <div className="space-y-2">
        <label className="block text-sm text-text-secondary">Import JSON</label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={SAMPLE_JSON}
          rows={8}
          className="w-full px-4 py-3 rounded-lg bg-bg-card text-text-primary border border-bg-card focus:border-accent outline-none font-mono text-sm resize-y"
        />
        {error && <p className="text-danger text-sm">{error}</p>}
        <button
          onClick={handleImport}
          disabled={!jsonInput.trim()}
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-30 text-white font-medium transition-colors active:scale-[0.98]"
        >
          Import Sentences
        </button>
      </div>
    </div>
  )
}
