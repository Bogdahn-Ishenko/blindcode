import { memo, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { getKeyLabel, type KeyDefinition, type KeyboardLocale } from '../data/keyboard'
import type { UiCopy } from '../data/translations'
import {
  useKeyFeedback,
  type KeyboardFeedbackStore,
} from '../hooks/useTypingEngine'

interface KeyCapProps {
  definition: KeyDefinition
  feedback: KeyboardFeedbackStore
  locale: KeyboardLocale
  copy: UiCopy
}

interface KeycapStyle extends CSSProperties {
  '--key-width': number
}

export const KeyCap = memo(function KeyCap({
  definition,
  feedback,
  locale,
  copy,
}: KeyCapProps) {
  const state = useKeyFeedback(feedback, definition.id)
  const keyCapRef = useRef<HTMLDivElement>(null)
  const shakeAnimationRef = useRef<Animation | null>(null)
  const label = getKeyLabel(definition.id, locale)
  const classNames = [
    'keycap',
    `zone-${definition.zone}`,
    definition.id === 'KeyF' || definition.id === 'KeyJ' ? 'is-home-anchor' : '',
    definition.width && definition.width > 1 ? 'is-wide' : '',
    definition.id === 'Space' ? 'is-space' : '',
    state.active ? 'is-active' : '',
    state.error ? 'is-error' : '',
    state.pressed ? 'is-pressed' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const keyStyle: KeycapStyle = {
    '--key-width': definition.width ?? 1,
  }

  useEffect(() => {
    const keyCap = keyCapRef.current

    if (!state.error) {
      shakeAnimationRef.current?.cancel()
      return
    }

    if (
      !state.pressed ||
      !keyCap ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    shakeAnimationRef.current?.cancel()
    shakeAnimationRef.current = keyCap.animate(
      [
        { translate: '0 0' },
        { translate: '-0.16rem 0' },
        { translate: '0.16rem 0' },
        { translate: '-0.08rem 0' },
        { translate: '0.04rem 0' },
        { translate: '0 0' },
      ],
      { duration: 180, easing: 'ease-out' },
    )
  }, [state.error, state.pressed])

  useEffect(
    () => () => shakeAnimationRef.current?.cancel(),
    [],
  )

  return (
    <div
      ref={keyCapRef}
      className={classNames}
      style={keyStyle}
      aria-label={[
        label,
        definition.id === 'KeyF' || definition.id === 'KeyJ'
          ? copy.homeRowAnchor
          : '',
        state.active ? copy.targetKey : '',
        state.error ? copy.incorrectKeyAria : '',
      ]
        .filter(Boolean)
        .join(', ')}
      aria-current={state.active ? 'true' : undefined}
      data-key-id={definition.id}
      data-state={state.error ? 'error' : state.active ? 'active' : undefined}
      role="img"
    >
      {definition.shiftedLabel ? (
        <span className="key-shifted-label">{definition.shiftedLabel}</span>
      ) : (
        <span className="key-shifted-label" aria-hidden="true">&nbsp;</span>
      )}
      <span className="key-label">{label}</span>
    </div>
  )
})
