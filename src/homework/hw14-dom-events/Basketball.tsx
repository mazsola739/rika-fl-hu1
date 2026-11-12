import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { cx } from '../../components/ui'
import ball from './assets/ball.png'
import court from './assets/court.png'

const COURT = { width: 600, height: 330 }
const BALL_SIZE = 40
const ZONE_SIZE = 15
const NOTIFICATION_MS = 3000

type Team = 'A' | 'B'

/** Scoring zones on the hoops: team B scores on the left hoop, team A on the right one. */
const zones: { team: Team; left: number }[] = [
  { team: 'B', left: 32 },
  { team: 'A', left: 552 },
]

export interface GoalDetail {
  team: Team
}

export function Basketball() {
  const courtRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({
    left: (COURT.width - BALL_SIZE) / 2,
    top: (COURT.height - BALL_SIZE) / 2,
  })
  const [scores, setScores] = useState<Record<Team, number>>({ A: 0, B: 0 })
  const [notification, setNotification] = useState<{ team: Team; visible: boolean } | null>(null)

  // The scoreboard listens to the custom "goal" event dispatched by the scoring zones.
  useEffect(() => {
    const element = courtRef.current
    if (!element) {
      return
    }
    let timer: ReturnType<typeof setTimeout> | undefined
    const handleGoal = (event: Event) => {
      const { team } = (event as CustomEvent<GoalDetail>).detail
      setScores((current) => ({ ...current, [team]: current[team] + 1 }))
      setNotification({ team, visible: true })
      clearTimeout(timer)
      timer = setTimeout(
        () => setNotification((current) => current && { ...current, visible: false }),
        NOTIFICATION_MS,
      )
    }
    element.addEventListener('goal', handleGoal)
    return () => {
      element.removeEventListener('goal', handleGoal)
      clearTimeout(timer)
    }
  }, [])

  function moveBall(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max)
    setPosition({
      left: clamp(event.clientX - rect.left - BALL_SIZE / 2, COURT.width - BALL_SIZE),
      top: clamp(event.clientY - rect.top - BALL_SIZE / 2, COURT.height - BALL_SIZE),
    })
  }

  function score(team: Team) {
    courtRef.current?.dispatchEvent(new CustomEvent<GoalDetail>('goal', { detail: { team } }))
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <div style={{ width: COURT.width }}>
        {/* biome-ignore lint/a11y/noStaticElementInteractions: pointer-only game area, like the original task */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: pointer-only game area, like the original task */}
        <div
          ref={courtRef}
          data-testid="court"
          onClick={moveBall}
          className="relative cursor-pointer"
          style={{ ...COURT, backgroundImage: `url(${court})`, backgroundSize: '100% 100%' }}
        >
          <img
            src={ball}
            alt="Ball"
            width={BALL_SIZE}
            height={BALL_SIZE}
            className="pointer-events-none absolute transition-[left,top] duration-1000"
            style={position}
          />
          {zones.map((zone) => (
            <button
              key={zone.team}
              type="button"
              aria-label={`Scoring zone of team ${zone.team}`}
              onClick={() => score(zone.team)}
              className="absolute cursor-pointer"
              style={{ left: zone.left, top: 155, width: ZONE_SIZE, height: ZONE_SIZE }}
            />
          ))}
        </div>

        <div className="mt-2 flex justify-between text-slate-700 dark:text-slate-200">
          <p>
            Team A: <span data-testid="score-A">{scores.A}</span>
          </p>
          <p>
            Team B: <span data-testid="score-B">{scores.B}</span>
          </p>
        </div>
        <p
          role="status"
          className={cx(
            'min-h-6 text-center font-bold transition-opacity duration-500',
            notification?.visible ? 'opacity-100' : 'opacity-0',
            notification?.team === 'A' ? 'text-[#5e81f3]' : 'text-[#de4388]',
          )}
        >
          {notification && `Team ${notification.team} scored!`}
        </p>
      </div>
    </div>
  )
}
