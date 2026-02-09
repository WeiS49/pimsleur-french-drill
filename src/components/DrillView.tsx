import type { Sentence, DrillState } from '../types'
import { TimeBar } from './TimeBar'

interface DrillViewProps {
  sentence: Sentence | null
  drillState: DrillState
  timeLeft: number
  totalTime: number
  currentIndex: number
  sentenceCount: number
  promptLanguage: 'cn' | 'en'
  onStart: () => void
  onStop: () => void
  onNext: () => void
  onPrev: () => void
  onReplay: () => void
}

function StateLabel({ state }: { state: DrillState }) {
  const labels: Record<DrillState, string> = {
    idle: '',
    prompt: 'LISTEN',
    anticipation: 'YOUR TURN',
    answer: 'ANSWER',
    pause: '...',
  }
  if (state === 'idle') return null
  return (
    <span className="text-xs font-bold tracking-widest text-text-muted uppercase">
      {labels[state]}
    </span>
  )
}

export function DrillView({
  sentence,
  drillState,
  timeLeft,
  totalTime,
  currentIndex,
  sentenceCount,
  promptLanguage,
  onStart,
  onStop,
  onNext,
  onPrev,
  onReplay,
}: DrillViewProps) {
  if (drillState === 'idle') {
    return (
      <div className="flex flex-col items-center gap-8 p-6">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-1">
            {sentenceCount} sentences loaded
          </p>
        </div>
        <button
          onClick={onStart}
          disabled={sentenceCount === 0}
          className="w-48 h-48 rounded-full bg-accent hover:bg-accent-hover disabled:opacity-30 text-white text-2xl font-bold transition-colors active:scale-95"
        >
          START
        </button>
      </div>
    )
  }

  const promptText = sentence
    ? promptLanguage === 'cn' ? sentence.cn : sentence.en
    : ''

  return (
    <div className="flex flex-col items-center gap-6 p-6 w-full max-w-lg">
      {/* Progress */}
      <div className="text-text-muted text-sm">
        {currentIndex + 1} / {sentenceCount}
      </div>

      {/* State indicator */}
      <StateLabel state={drillState} />

      {/* Sentence display */}
      <div className="bg-bg-card rounded-2xl p-8 w-full text-center min-h-[160px] flex flex-col items-center justify-center gap-4">
        {drillState === 'prompt' && (
          <p className="text-2xl text-text-primary">{promptText}</p>
        )}

        {drillState === 'anticipation' && (
          <>
            <p className="text-text-secondary text-lg">{promptText}</p>
            <p className="text-xl text-warning font-medium animate-pulse">
              {promptLanguage === 'cn' ? '请尝试用法语说出...' : 'Try to say it in French...'}
            </p>
          </>
        )}

        {drillState === 'answer' && (
          <>
            <p className="text-text-secondary text-base">{promptText}</p>
            <p className="text-3xl text-success font-bold">{sentence?.fr}</p>
          </>
        )}

        {drillState === 'pause' && (
          <p className="text-text-muted text-lg">...</p>
        )}
      </div>

      {/* Time bar */}
      {drillState === 'anticipation' && (
        <div className="w-full px-2">
          <TimeBar timeLeft={timeLeft} totalTime={totalTime} />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          className="w-14 h-14 rounded-full bg-bg-card hover:bg-bg-secondary text-text-secondary text-xl transition-colors active:scale-95"
          title="Previous"
        >
          &#9664;
        </button>
        <button
          onClick={onReplay}
          className="w-14 h-14 rounded-full bg-bg-card hover:bg-bg-secondary text-text-secondary text-xl transition-colors active:scale-95"
          title="Replay"
        >
          &#8634;
        </button>
        <button
          onClick={onStop}
          className="w-16 h-16 rounded-full bg-danger hover:bg-red-600 text-white text-xl font-bold transition-colors active:scale-95"
          title="Stop"
        >
          &#9632;
        </button>
        <button
          onClick={onNext}
          className="w-14 h-14 rounded-full bg-bg-card hover:bg-bg-secondary text-text-secondary text-xl transition-colors active:scale-95"
          title="Next"
        >
          &#9654;
        </button>
      </div>
    </div>
  )
}
