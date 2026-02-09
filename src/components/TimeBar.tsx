interface TimeBarProps {
  timeLeft: number
  totalTime: number
}

export function TimeBar({ timeLeft, totalTime }: TimeBarProps) {
  const fraction = totalTime > 0 ? timeLeft / totalTime : 0

  return (
    <div className="w-full h-3 bg-bg-card rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-100 ease-linear"
        style={{
          width: `${fraction * 100}%`,
          backgroundColor: fraction > 0.3 ? 'var(--color-accent)' : 'var(--color-warning)',
        }}
      />
    </div>
  )
}
