import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { getDisplayedKeyLabel, getTargetKeyIds } from '../data/keyboard'
import type { CodeSnippet } from '../data/snippets'

interface KeyState {
  active: boolean
  error: boolean
  pressed: boolean
}

const EMPTY_KEY_STATE: KeyState = {
  active: false,
  error: false,
  pressed: false,
}

function stateSnapshot(state: KeyState): string {
  return `${Number(state.active)}${Number(state.error)}${Number(state.pressed)}`
}

export class KeyboardFeedbackStore {
  private readonly states = new Map<string, KeyState>()
  private readonly listeners = new Map<string, Set<() => void>>()
  private activeKeys = new Set<string>()
  private errorKeys = new Set<string>()

  subscribe = (keyId: string, listener: () => void): (() => void) => {
    let subscribers = this.listeners.get(keyId)

    if (!subscribers) {
      subscribers = new Set()
      this.listeners.set(keyId, subscribers)
    }

    subscribers.add(listener)

    return () => {
      subscribers?.delete(listener)

      if (subscribers?.size === 0) {
        this.listeners.delete(keyId)
      }
    }
  }

  getSnapshot = (keyId: string): string =>
    stateSnapshot(this.states.get(keyId) ?? EMPTY_KEY_STATE)

  setActiveKeys(keyIds: readonly string[]): void {
    const nextKeys = new Set(keyIds)
    const changedKeys = new Set([...this.activeKeys, ...nextKeys])

    for (const keyId of changedKeys) {
      this.updateKey(keyId, { active: nextKeys.has(keyId) })
    }

    this.activeKeys = nextKeys
  }

  setError(keyId: string): void {
    this.errorKeys.add(keyId)
    this.updateKey(keyId, { error: true })
  }

  clearErrors(): void {
    for (const keyId of this.errorKeys) {
      this.updateKey(keyId, { error: false })
    }

    this.errorKeys.clear()
  }

  setPressed(keyId: string, pressed: boolean): void {
    this.updateKey(keyId, { pressed })
  }

  clear(): void {
    const changedKeys = new Set([
      ...this.activeKeys,
      ...this.errorKeys,
      ...this.states.keys(),
    ])

    for (const keyId of changedKeys) {
      this.updateKey(keyId, { active: false, error: false, pressed: false })
    }

    this.activeKeys.clear()
    this.errorKeys.clear()
  }

  private updateKey(keyId: string, patch: Partial<KeyState>): void {
    const current = this.states.get(keyId) ?? EMPTY_KEY_STATE
    const next = { ...current, ...patch }

    if (stateSnapshot(current) === stateSnapshot(next)) {
      return
    }

    this.states.set(keyId, next)
    this.listeners.get(keyId)?.forEach((listener) => listener())
  }
}

interface EngineStats {
  wpm: number
  cpm: number
  accuracy: number
}

interface UseTypingEngineResult {
  cursor: number
  complete: boolean
  errorPulse: number
  hasError: boolean
  hasStarted: boolean
  progress: number
  runId: number
  stats: EngineStats
  feedback: KeyboardFeedbackStore
  reset: () => void
}

function getAutoIndentEnd(code: string, cursor: number): number {
  let end = cursor

  while (code[end] === ' ') {
    end += 1
  }

  return end
}

function getTabWidth(code: string, cursor: number, indentation: number): number {
  const lineStart = code.lastIndexOf('\n', cursor - 1) + 1
  const column = cursor - lineStart

  return indentation - (column % indentation)
}

function getActiveKeyIds(
  code: string,
  cursor: number,
  indentation: number,
): readonly string[] {
  const character = code[cursor] ?? ''
  const targetKeys = getTargetKeyIds(character)

  if (character !== ' ') {
    return targetKeys
  }

  const lineStart = code.lastIndexOf('\n', cursor - 1) + 1
  const linePrefix = code.slice(lineStart, cursor)

  if (/^ *$/.test(linePrefix) && linePrefix.length < indentation) {
    return [...targetKeys, 'Tab']
  }

  return targetKeys
}

function calculateStats(
  attempts: number,
  successfulAttempts: number,
  typedCharacters: number,
  elapsedMilliseconds: number,
): EngineStats {
  if (elapsedMilliseconds <= 0) {
    return { wpm: 0, cpm: 0, accuracy: 100 }
  }

  const elapsedMinutes = elapsedMilliseconds / 60_000

  return {
    wpm: Math.round((typedCharacters / 5 / elapsedMinutes) * 10) / 10,
    cpm: Math.round(typedCharacters / elapsedMinutes),
    accuracy:
      attempts === 0
        ? 100
        : Math.round((successfulAttempts / attempts) * 1000) / 10,
  }
}

export function useTypingEngine(snippet: CodeSnippet): UseTypingEngineResult {
  const [cursor, setCursor] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [errorPulse, setErrorPulse] = useState(0)
  const [runId, setRunId] = useState(0)
  const [stats, setStats] = useState<EngineStats>({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
  })
  const cursorRef = useRef(0)
  const attemptsRef = useRef(0)
  const successfulAttemptsRef = useRef(0)
  const typedCharactersRef = useRef(0)
  const startedAtRef = useRef<number | null>(null)
  const pressTimersRef = useRef(new Map<string, number>())
  const [feedback] = useState(() => new KeyboardFeedbackStore())
  const complete = cursor >= snippet.code.length
  const progress = Math.round((cursor / snippet.code.length) * 100)

  const refreshStats = useCallback((now: number) => {
    const startedAt = startedAtRef.current
    const elapsed = startedAt === null ? 0 : now - startedAt

    setStats(
      calculateStats(
        attemptsRef.current,
        successfulAttemptsRef.current,
        typedCharactersRef.current,
        elapsed,
      ),
    )
  }, [])

  const reset = useCallback(() => {
    cursorRef.current = 0
    attemptsRef.current = 0
    successfulAttemptsRef.current = 0
    typedCharactersRef.current = 0
    startedAtRef.current = null
    setCursor(0)
    setHasError(false)
    setHasStarted(false)
    setErrorPulse(0)
    setRunId((currentRunId) => currentRunId + 1)
    setStats({ wpm: 0, cpm: 0, accuracy: 100 })
    feedback.clear()
    feedback.setActiveKeys(getActiveKeyIds(snippet.code, 0, snippet.indentation))

    for (const timer of pressTimersRef.current.values()) {
      window.clearTimeout(timer)
    }

    pressTimersRef.current.clear()
  }, [feedback, snippet.code, snippet.indentation])

  useEffect(() => {
    feedback.setActiveKeys(getActiveKeyIds(snippet.code, 0, snippet.indentation))
  }, [feedback, snippet.code, snippet.indentation])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (
        startedAtRef.current !== null &&
        cursorRef.current < snippet.code.length
      ) {
        refreshStats(performance.now())
      }
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [refreshStats, snippet.code.length])

  useEffect(() => {
    const pressTimers = pressTimersRef.current

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.code) {
        feedback.setPressed(event.code, true)
        const previousTimer = pressTimers.get(event.code)

        if (previousTimer !== undefined) {
          window.clearTimeout(previousTimer)
        }

        const timer = window.setTimeout(() => {
          feedback.setPressed(event.code, false)
          pressTimers.delete(event.code)
        }, 80)
        pressTimers.set(event.code, timer)
      }

      const target = event.target

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('input, select, textarea, button, [role="combobox"]'))
      ) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        reset()
        return
      }

      if (
        event.key === 'Shift' ||
        event.key === 'Control' ||
        event.key === 'Alt' ||
        event.key === 'Meta' ||
        event.isComposing
      ) {
        return
      }

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        cursorRef.current >= snippet.code.length
      ) {
        return
      }

      event.preventDefault()

      const now = performance.now()
      if (startedAtRef.current === null) {
        startedAtRef.current = now
        setHasStarted(true)
      }
      attemptsRef.current += 1

      const position = cursorRef.current
      const expected = snippet.code[position]
      let nextCursor = position
      let typedCharacters = 0
      let isCorrect = false

      if (expected !== undefined && event.key === 'Tab') {
        const tabWidth = getTabWidth(
          snippet.code,
          position,
          snippet.indentation,
        )
        const tabText = ' '.repeat(tabWidth)

        if (snippet.code.slice(position, position + tabWidth) === tabText) {
          nextCursor = position + tabWidth
          typedCharacters = tabWidth
          isCorrect = true
        }
      } else if (expected !== undefined && event.key === 'Enter') {
        if (expected === '\n') {
          nextCursor = getAutoIndentEnd(snippet.code, position + 1)
          typedCharacters = nextCursor - position
          isCorrect = true
        }
      } else if (expected !== undefined && event.key === expected) {
        nextCursor = position + 1
        typedCharacters = 1
        isCorrect = true
      }

      if (isCorrect) {
        successfulAttemptsRef.current += 1
        typedCharactersRef.current += typedCharacters
        cursorRef.current = nextCursor
        setCursor(nextCursor)
        setHasError(false)
        feedback.clearErrors()
        feedback.setActiveKeys(
          getActiveKeyIds(snippet.code, nextCursor, snippet.indentation),
        )
      } else {
        setHasError(true)
        setErrorPulse((pulse) => pulse + 1)
        feedback.setError(event.code || getDisplayedKeyLabel(event.key))
      }

      refreshStats(now)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)

      for (const timer of pressTimers.values()) {
        window.clearTimeout(timer)
      }

      pressTimers.clear()
    }
  }, [feedback, refreshStats, reset, snippet])

  return {
    cursor,
    complete,
    errorPulse,
    hasError,
    hasStarted,
    progress,
    runId,
    stats,
    feedback,
    reset,
  }
}

export function useKeyFeedback(
  feedback: KeyboardFeedbackStore,
  keyId: string,
): KeyState {
  const snapshot = useSyncExternalStore(
    (listener) => feedback.subscribe(keyId, listener),
    () => feedback.getSnapshot(keyId),
    () => feedback.getSnapshot(keyId),
  )

  return {
    active: snapshot[0] === '1',
    error: snapshot[1] === '1',
    pressed: snapshot[2] === '1',
  }
}
