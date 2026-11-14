export type FingerZone =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb'
  | 'modifier'

export interface KeyDefinition {
  id: string
  label: string
  shiftedLabel?: string
  width?: number
  zone: FingerZone
}

export type KeyboardLocale = 'en' | 'ru'

const key = (
  id: string,
  label: string,
  zone: FingerZone,
  width = 1,
  shiftedLabel?: string,
): KeyDefinition => ({
  id,
  label,
  zone,
  width,
  ...(shiftedLabel ? { shiftedLabel } : {}),
})

export const keyboardRows: readonly (readonly KeyDefinition[])[] = [
  [
    key('Backquote', '`', 'left-pinky', 1, '~'),
    key('Digit1', '1', 'left-pinky', 1, '!'),
    key('Digit2', '2', 'left-ring', 1, '@'),
    key('Digit3', '3', 'left-middle', 1, '#'),
    key('Digit4', '4', 'left-index', 1, '$'),
    key('Digit5', '5', 'left-index', 1, '%'),
    key('Digit6', '6', 'right-index', 1, '^'),
    key('Digit7', '7', 'right-index', 1, '&'),
    key('Digit8', '8', 'right-middle', 1, '*'),
    key('Digit9', '9', 'right-ring', 1, '('),
    key('Digit0', '0', 'right-pinky', 1, ')'),
    key('Minus', '-', 'right-pinky', 1, '_'),
    key('Equal', '=', 'right-pinky', 1, '+'),
    key('Backspace', 'Backspace', 'right-pinky', 2),
  ],
  [
    key('Tab', 'Tab', 'left-pinky', 1.5),
    key('KeyQ', 'Q', 'left-pinky'),
    key('KeyW', 'W', 'left-ring'),
    key('KeyE', 'E', 'left-middle'),
    key('KeyR', 'R', 'left-index'),
    key('KeyT', 'T', 'left-index'),
    key('KeyY', 'Y', 'right-index'),
    key('KeyU', 'U', 'right-index'),
    key('KeyI', 'I', 'right-middle'),
    key('KeyO', 'O', 'right-ring'),
    key('KeyP', 'P', 'right-pinky'),
    key('BracketLeft', '[', 'right-pinky', 1, '{'),
    key('BracketRight', ']', 'right-pinky', 1, '}'),
    key('Backslash', '\\', 'right-pinky', 1.5, '|'),
  ],
  [
    key('CapsLock', 'Caps', 'left-pinky', 1.75),
    key('KeyA', 'A', 'left-pinky'),
    key('KeyS', 'S', 'left-ring'),
    key('KeyD', 'D', 'left-middle'),
    key('KeyF', 'F', 'left-index'),
    key('KeyG', 'G', 'left-index'),
    key('KeyH', 'H', 'right-index'),
    key('KeyJ', 'J', 'right-index'),
    key('KeyK', 'K', 'right-middle'),
    key('KeyL', 'L', 'right-ring'),
    key('Semicolon', ';', 'right-pinky', 1, ':'),
    key('Quote', "'", 'right-pinky', 1, '"'),
    key('Enter', 'Enter', 'right-pinky', 2.25),
  ],
  [
    key('ShiftLeft', 'Shift', 'left-pinky', 2.25),
    key('KeyZ', 'Z', 'left-pinky'),
    key('KeyX', 'X', 'left-ring'),
    key('KeyC', 'C', 'left-middle'),
    key('KeyV', 'V', 'left-index'),
    key('KeyB', 'B', 'left-index'),
    key('KeyN', 'N', 'right-index'),
    key('KeyM', 'M', 'right-index'),
    key('Comma', ',', 'right-middle', 1, '<'),
    key('Period', '.', 'right-ring', 1, '>'),
    key('Slash', '/', 'right-pinky', 1, '?'),
    key('ShiftRight', 'Shift', 'right-pinky', 2.75),
  ],
  [
    key('ControlLeft', 'Ctrl', 'modifier', 1.25),
    key('MetaLeft', 'Win', 'modifier', 1.25),
    key('AltLeft', 'Alt', 'modifier', 1.25),
    key('Space', 'Space', 'thumb', 6.5),
    key('AltRight', 'Alt', 'modifier', 1.25),
    key('MetaRight', 'Win', 'modifier', 1.25),
    key('ContextMenu', 'Menu', 'modifier', 1.25),
    key('ControlRight', 'Ctrl', 'modifier', 1.25),
  ],
]

const shiftedCharacters: Readonly<Record<string, string>> = {
  '~': 'Backquote',
  '!': 'Digit1',
  '@': 'Digit2',
  '#': 'Digit3',
  '$': 'Digit4',
  '%': 'Digit5',
  '^': 'Digit6',
  '&': 'Digit7',
  '*': 'Digit8',
  '(': 'Digit9',
  ')': 'Digit0',
  _: 'Minus',
  '+': 'Equal',
  '{': 'BracketLeft',
  '}': 'BracketRight',
  '|': 'Backslash',
  ':': 'Semicolon',
  '"': 'Quote',
  '<': 'Comma',
  '>': 'Period',
  '?': 'Slash',
}

const unshiftedCharacters: Readonly<Record<string, string>> = {
  '`': 'Backquote',
  '-': 'Minus',
  '=': 'Equal',
  '[': 'BracketLeft',
  ']': 'BracketRight',
  '\\': 'Backslash',
  ';': 'Semicolon',
  "'": 'Quote',
  ',': 'Comma',
  '.': 'Period',
  '/': 'Slash',
}

const rightHandKeys = new Set([
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Digit0',
  'Minus',
  'Equal',
  'KeyY',
  'KeyU',
  'KeyI',
  'KeyO',
  'KeyP',
  'BracketLeft',
  'BracketRight',
  'Backslash',
  'KeyH',
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
  'Quote',
  'KeyN',
  'KeyM',
  'Comma',
  'Period',
  'Slash',
])

export function getKeyIdForCharacter(character: string): string | undefined {
  if (character === ' ') {
    return 'Space'
  }

  if (character === '\n') {
    return 'Enter'
  }

  if (character.length === 1 && /[a-z]/i.test(character)) {
    return `Key${character.toUpperCase()}`
  }

  if (character.length === 1 && /[0-9]/.test(character)) {
    return `Digit${character}`
  }

  const keyId = unshiftedCharacters[character]

  if (keyId) {
    return keyId
  }

  return shiftedCharacters[character]
}

export function getTargetKeyIds(character: string): readonly string[] {
  const keyId = getKeyIdForCharacter(character)

  if (!keyId) {
    return []
  }

  const requiresShift =
    (character.length === 1 && /[A-Z]/.test(character)) ||
    Object.hasOwn(shiftedCharacters, character)

  if (!requiresShift) {
    return [keyId]
  }

  const shiftId = rightHandKeys.has(keyId) ? 'ShiftLeft' : 'ShiftRight'

  return [keyId, shiftId]
}

export function getDisplayedKeyLabel(keyId: string): string {
  for (const row of keyboardRows) {
    const definition = row.find((candidate) => candidate.id === keyId)

    if (definition) {
      return definition.label
    }
  }

  return keyId
}

export function getKeyLabel(keyId: string, locale: KeyboardLocale): string {
  const russianLabels: Readonly<Record<string, string>> = {
    Tab: 'Таб',
    Backspace: 'Назад',
    CapsLock: 'Caps',
    Enter: 'Ввод',
    Space: 'Пробел',
  }

  return locale === 'ru'
    ? (russianLabels[keyId] ?? getDisplayedKeyLabel(keyId))
    : getDisplayedKeyLabel(keyId)
}
