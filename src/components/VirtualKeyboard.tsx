import { memo } from 'react'
import { keyboardRows } from '../data/keyboard'
import { KeyCap } from './KeyCap'
import type { KeyboardFeedbackStore } from '../hooks/useTypingEngine'
import type { KeyboardLocale } from '../data/keyboard'
import type { UiCopy } from '../data/translations'

interface VirtualKeyboardProps {
  feedback: KeyboardFeedbackStore
  locale: KeyboardLocale
  copy: UiCopy
}

export const VirtualKeyboard = memo(function VirtualKeyboard({
  feedback,
  locale,
  copy,
}: VirtualKeyboardProps) {
  return (
    <div className="keyboard" aria-label={copy.keyboardLabel} role="group">
      {keyboardRows.map((row, rowIndex) => (
        <div className="keyboard-row" key={`row-${rowIndex + 1}`}>
          {row.map((definition) => (
            <KeyCap
              key={definition.id}
              definition={definition}
              feedback={feedback}
              locale={locale}
              copy={copy}
            />
          ))}
        </div>
      ))}
    </div>
  )
})
