export type Locale = 'en' | 'ru'

export interface UiCopy {
  pageTitle: string
  home: string
  interfaceLanguage: string
  language: string
  exercise: string
  task: string
  of: string
  typingStatistics: string
  accuracy: string
  typingSession: string
  pageHeading: string
  snippetComplete: string
  snippetProgress: string
  strictMode: string
  codeToType: string
  spaces: string
  incorrectKey: string
  complete: string
  ready: string
  incorrectKeyHint: string
  completeHint: string
  keepGoing: string
  pressAnyKey: string
  restart: string
  completionTitle: string
  tryAgain: string
  keyboardHeading: string
  fingerZones: string
  pinky: string
  ring: string
  middle: string
  index: string
  thumb: string
  keyboardLabel: string
  practiceFooter: string
  indent: string
  newLine: string
  targetKey: string
  homeRowAnchor: string
  incorrectKeyAria: string
  snippetPosition: (cursor: number, length: number) => string
}

export const translations = {
  en: {
    pageTitle: 'Codeform — code typing practice',
    home: 'Codeform home',
    interfaceLanguage: 'Interface language',
    language: 'Language',
    exercise: 'Exercise',
    task: 'Task',
    of: 'of',
    typingStatistics: 'Typing statistics',
    accuracy: 'Accuracy',
    typingSession: 'Typing session',
    pageHeading: 'Type code by touch',
    snippetComplete: 'Exercise complete',
    snippetProgress: 'Exercise progress',
    strictMode: 'Strict mode',
    codeToType: 'code to type',
    spaces: 'spaces',
    incorrectKey: 'Incorrect key',
    complete: 'Complete',
    ready: 'Ready',
    incorrectKeyHint: 'Wrong key — correct the highlighted character to continue',
    completeHint: 'Exercise complete — choose another task or restart',
    keepGoing: 'Keep going — strict mode is on',
    pressAnyKey: 'Press any key to begin',
    restart: 'Restart',
    completionTitle: 'Session complete',
    tryAgain: 'Practice again',
    keyboardHeading: 'Keep your hands on home row',
    fingerZones: 'Finger zones',
    pinky: 'Pinky',
    ring: 'Ring',
    middle: 'Middle',
    index: 'Index',
    thumb: 'Thumb',
    keyboardLabel: 'ANSI QWERTY keyboard',
    practiceFooter: 'Practice the code you write',
    indent: 'indent',
    newLine: 'new line',
    targetKey: 'target key',
    homeRowAnchor: 'home row position',
    incorrectKeyAria: 'incorrect key',
    snippetPosition: (cursor, length) =>
      `Character ${Math.min(cursor + 1, length)} of ${length}`,
  },
  ru: {
    pageTitle: 'Codeform — тренажёр слепой печати кода',
    home: 'На главную Codeform',
    interfaceLanguage: 'Язык интерфейса',
    language: 'Язык',
    exercise: 'Упражнение',
    task: 'Задача',
    of: 'из',
    typingStatistics: 'Статистика печати',
    accuracy: 'Точность',
    typingSession: 'Тренировка',
    pageHeading: 'Печатай код вслепую',
    snippetComplete: 'Упражнение завершено',
    snippetProgress: 'Прогресс упражнения',
    strictMode: 'Строгий режим',
    codeToType: 'код для ввода',
    spaces: 'пробела',
    incorrectKey: 'Неверная клавиша',
    complete: 'Готово',
    ready: 'Ожидание',
    incorrectKeyHint: 'Неверная клавиша — исправьте подсвеченный символ, чтобы продолжить',
    completeHint: 'Упражнение завершено — выберите задачу или начните заново',
    keepGoing: 'Продолжайте — строгий режим включён',
    pressAnyKey: 'Нажмите любую клавишу, чтобы начать',
    restart: 'Заново',
    completionTitle: 'Тренировка завершена',
    tryAgain: 'Повторить',
    keyboardHeading: 'Держите пальцы на основном ряду',
    fingerZones: 'Зоны пальцев',
    pinky: 'Мизинец',
    ring: 'Безымянный',
    middle: 'Средний',
    index: 'Указательный',
    thumb: 'Большой',
    keyboardLabel: 'Клавиатура ANSI QWERTY',
    practiceFooter: 'Тренируйтесь на знакомом коде',
    indent: 'отступ',
    newLine: 'новая строка',
    targetKey: 'нужная клавиша',
    homeRowAnchor: 'ориентир основного ряда',
    incorrectKeyAria: 'неверная клавиша',
    snippetPosition: (cursor, length) =>
      `Символ ${Math.min(cursor + 1, length)} из ${length}`,
  },
} satisfies Record<Locale, UiCopy>
