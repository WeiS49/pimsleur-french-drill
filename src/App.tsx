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
            {!isConfigured || sentences.length === 0 ? (
              <div className="text-center p-6 max-w-sm space-y-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  Welcome to Pimsleur FR
                </h2>
                <p className="text-text-secondary">
                  Audio-first French training. Complete the setup below to start.
                </p>
                <div className="space-y-3 text-left">
                  <SetupStep
                    n={1}
                    done={!!settings.apiKey && !!settings.voiceIdFr}
                    label="Configure API Key & Voices"
                    onClick={() => setPage('settings')}
                  />
                  <SetupStep
                    n={2}
                    done={sentences.length > 0}
                    label="Load Sentences"
                    onClick={() => setPage('sentences')}
                  />
                  <SetupStep
                    n={3}
                    done={false}
                    label="Start Drilling!"
                    disabled={!isConfigured || sentences.length === 0}
                  />
                </div>
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

function SetupStep({
  n,
  done,
  label,
  onClick,
  disabled,
}: {
  n: number
  done: boolean
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
        done
          ? 'bg-success/10 text-success'
          : disabled
            ? 'bg-bg-card/50 text-text-muted cursor-default'
            : 'bg-bg-card hover:bg-bg-secondary text-text-primary cursor-pointer'
      }`}
    >
      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
        done ? 'bg-success text-white' : 'bg-bg-secondary text-text-muted'
      }`}>
        {done ? '\u2713' : n}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

export default App
