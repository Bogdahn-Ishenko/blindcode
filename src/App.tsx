import { useEffect, useState } from 'react'
import { CompletionCard } from './components/CompletionCard'
import { CustomCursor } from './components/CustomCursor'
import { CustomSelect } from './components/CustomSelect'
import { EditorWindow } from './components/EditorWindow'
import { StatsBar } from './components/StatsBar'
import { VirtualKeyboard } from './components/VirtualKeyboard'
import {
  getExercisesForLanguage,
  languages,
  type CodeSnippet,
  type LanguageId,
} from './data/snippets'
import { translations, type Locale, type UiCopy } from './data/translations'
import { useTypingEngine } from './hooks/useTypingEngine'
import './App.css'

const languageOptions = languages.map((language) => ({
  value: language.id,
  label: language.label,
  indicatorClass: `language-${language.id}`,
}))

interface TypingWorkspaceProps {
  snippet: CodeSnippet
  exerciseNumber: number
  exerciseCount: number
  locale: Locale
  copy: UiCopy
  onSelectLanguage: (languageId: LanguageId) => void
  onSelectExercise: (exerciseId: string) => void
  onSelectLocale: (locale: Locale) => void
}

function TypingWorkspace({
  snippet,
  exerciseNumber,
  exerciseCount,
  locale,
  copy,
  onSelectLanguage,
  onSelectExercise,
  onSelectLocale,
}: TypingWorkspaceProps) {
  const engine = useTypingEngine(snippet)
  const exercises = getExercisesForLanguage(snippet.languageId)
  const exerciseOptions = exercises.map((exercise, index) => ({
    value: exercise.id,
    label: `${copy.task} ${String(index + 1).padStart(2, '0')}`,
  }))

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label={copy.home}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-name">codeform</span>
        </a>
        <div className="topbar-divider" />
        <div className="toolbar-controls">
          <CustomSelect
            label={copy.language}
            value={snippet.languageId}
            options={languageOptions}
            onChange={onSelectLanguage}
          />
          <CustomSelect
            label={copy.exercise}
            value={snippet.id}
            options={exerciseOptions}
            onChange={onSelectExercise}
          />
        </div>
        <div className="locale-switch" role="group" aria-label={copy.interfaceLanguage}>
          <button
            type="button"
            aria-pressed={locale === 'ru'}
            onClick={() => onSelectLocale('ru')}
          >
            RU
          </button>
          <button
            type="button"
            aria-pressed={locale === 'en'}
            onClick={() => onSelectLocale('en')}
          >
            EN
          </button>
        </div>
        <StatsBar stats={engine.stats} copy={copy} />
      </header>

      <section className="practice-panel" aria-label={copy.typingSession}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.typingSession}</p>
            <h1>{copy.pageHeading}</h1>
          </div>
          <div className="progress-readout" aria-live="polite">
            <span className="progress-value">{engine.progress}%</span>
            <span className="progress-label">
              {engine.complete ? copy.snippetComplete : copy.snippetProgress}
            </span>
          </div>
        </div>
        <div className="editor-stage">
          <EditorWindow
            snippet={snippet}
            cursor={engine.cursor}
            error={engine.hasError}
            complete={engine.complete}
            errorPulse={engine.errorPulse}
            hasStarted={engine.hasStarted}
            runId={engine.runId}
            copy={copy}
          />
          {engine.complete ? (
            <CompletionCard
              stats={engine.stats}
              copy={copy}
              onRestart={engine.reset}
            />
          ) : null}
        </div>
      </section>

      <section className="keyboard-section" aria-label={copy.keyboardLabel}>
        <div className="keyboard-heading">
          <div>
            <h2>{copy.keyboardHeading}</h2>
          </div>
          <div className="finger-legend" aria-label={copy.fingerZones}>
            <span className="legend-item"><i className="zone-dot zone-pinky" />{copy.pinky}</span>
            <span className="legend-item"><i className="zone-dot zone-ring" />{copy.ring}</span>
            <span className="legend-item"><i className="zone-dot zone-middle" />{copy.middle}</span>
            <span className="legend-item"><i className="zone-dot zone-index" />{copy.index}</span>
            <span className="legend-item"><i className="zone-dot zone-thumb" />{copy.thumb}</span>
          </div>
        </div>
        <VirtualKeyboard feedback={engine.feedback} locale={locale} copy={copy} />
        <div className="keyboard-footer">
          <span>
            {engine.hasError
              ? copy.incorrectKeyHint
              : engine.complete
                ? copy.completeHint
                : engine.hasStarted
                  ? copy.keepGoing
                  : copy.pressAnyKey}
          </span>
          <button className="reset-button" type="button" onClick={engine.reset}>
            {copy.restart}
            <kbd>Esc</kbd>
          </button>
        </div>
      </section>
      <footer className="page-footer">
        <span>{copy.practiceFooter}</span>
        <span className="footer-shortcut">
          <kbd>Tab</kbd> {copy.indent} <kbd>Enter</kbd> {copy.newLine}
        </span>
      </footer>
      <span className="visually-hidden" aria-live="polite">
        {copy.task} {exerciseNumber} {copy.of} {exerciseCount}
      </span>
    </main>
  )
}

function App() {
  const [locale, setLocale] = useState<Locale>('ru')
  const [languageId, setLanguageId] = useState<LanguageId>('javascript')
  const [selectedId, setSelectedId] = useState('javascript-1')
  const copy = translations[locale]
  const exercises = getExercisesForLanguage(languageId)
  const selectedSnippet = exercises.find((snippet) => snippet.id === selectedId)
  const exerciseNumber =
    exercises.findIndex((snippet) => snippet.id === selectedId) + 1

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = copy.pageTitle
  }, [copy.pageTitle, locale])

  if (!selectedSnippet) {
    throw new Error(`Unknown typing exercise: ${selectedId}`)
  }

  function selectLanguage(nextLanguageId: LanguageId): void {
    const firstExercise = getExercisesForLanguage(nextLanguageId)[0]

    if (!firstExercise) {
      throw new Error(`No typing exercises found for language: ${nextLanguageId}`)
    }

    setLanguageId(nextLanguageId)
    setSelectedId(firstExercise.id)
  }

  function selectExercise(exerciseId: string): void {
    const nextExercise = exercises.find((exercise) => exercise.id === exerciseId)

    if (!nextExercise) {
      throw new Error(`Unknown typing exercise for ${languageId}: ${exerciseId}`)
    }

    setSelectedId(nextExercise.id)
  }

  return (
    <>
      <CustomCursor />
      <TypingWorkspace
        key={selectedSnippet.id}
        snippet={selectedSnippet}
        exerciseNumber={exerciseNumber}
        exerciseCount={exercises.length}
        locale={locale}
        copy={copy}
        onSelectLanguage={selectLanguage}
        onSelectExercise={selectExercise}
        onSelectLocale={setLocale}
      />
    </>
  )
}

export default App
