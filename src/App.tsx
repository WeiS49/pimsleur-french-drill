import { useState, useEffect } from 'react'
import type { Sentence, Settings } from './types'
import { loadSettings, saveSettings, loadSentences, saveSentences } from './utils/storage'
import { useDrill } from './hooks/useDrill'
import { DrillView } from './components/DrillView'
import { SettingsView } from './components/SettingsView'
import { SentenceManager } from './components/SentenceManager'

type Page = 'drill' | 'sentences' | 'settings'

function App() {
  const [page, setPage] = useState<Page>('drill')
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [sentences, setSentences] = useState<Sentence[]>(loadSentences)

  const drill = useDrill(sentences, settings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveSentences(sentences)
  }, [sentences])

  const isConfigured = settings.apiKey && settings.voiceIdFr

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-bg-card">
        <h1 className="text-lg font-bold text-text-primary">Pimsleur FR</h1>
        <nav className="flex gap-1">
          {(['drill', 'sentences', 'settings'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                page === p
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-bg-card'
              }`}
            >
              {p === 'drill' ? 'Drill' : p === 'sentences' ? 'Sentences' : 'Settings'}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {page === 'drill' && (
          <>
            {!isConfigured ? (
              <div className="text-center p-6 space-y-4">
                <p className="text-text-secondary text-lg">
                  Please configure your API key and voice IDs first.
                </p>
                <button
                  onClick={() => setPage('settings')}
                  className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors"
                >
                  Go to Settings
                </button>
              </div>
            ) : sentences.length === 0 ? (
              <div className="text-center p-6 space-y-4">
                <p className="text-text-secondary text-lg">
                  No sentences loaded. Import some to start drilling.
                </p>
                <button
                  onClick={() => setPage('sentences')}
                  className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white transition-colors"
                >
                  Import Sentences
                </button>
              </div>
            ) : (
              <DrillView
                sentence={drill.currentSentence}
                drillState={drill.drillState}
                timeLeft={drill.timeLeft}
                totalTime={drill.totalTime}
                currentIndex={drill.currentIndex}
                sentenceCount={drill.sentenceCount}
                promptLanguage={settings.promptLanguage}
                onStart={drill.start}
                onStop={drill.stop}
                onNext={drill.next}
                onPrev={drill.prev}
                onReplay={drill.replay}
              />
            )}
          </>
        )}

        {page === 'sentences' && (
          <SentenceManager sentences={sentences} onSave={setSentences} />
        )}

        {page === 'settings' && (
          <SettingsView settings={settings} onSave={setSettings} />
        )}
      </main>
    </div>
  )
}

export default App
