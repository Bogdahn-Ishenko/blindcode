import { memo, useEffect, useLayoutEffect, useRef } from 'react'
import type { CodeSnippet } from '../data/snippets'
import type { UiCopy } from '../data/translations'

interface EditorWindowProps {
  snippet: CodeSnippet
  cursor: number
  error: boolean
  complete: boolean
  errorPulse: number
  hasStarted: boolean
  runId: number
  copy: UiCopy
}

interface EditorLine {
  line: string
  offset: number
}

const keywords = new Set([
  'const',
  'return',
  'function',
  'def',
  'import',
  'from',
  'if',
  'else',
  'for',
  'while',
  'class',
  'print',
  'console',
  'let',
  'var',
  'new',
  'true',
  'false',
  'null',
  'undefined',
  'await',
  'async',
  'this',
  'val',
  'def',
  'object',
  'boolean',
  'int',
  'bool',
  'func',
  'fn',
  'pub',
  'let',
  'mut',
  'use',
  'std',
  'include',
  'return',
  'var',
  'foreach',
  'in',
  'is',
  'class',
  'public',
  'private',
  'static',
  'void',
  'using',
  'namespace',
  'auto',
])

const typeNames = new Set([
  'number',
  'string',
  'boolean',
  'int',
  'float',
  'str',
  'bool',
  'Int',
  'String',
  'Boolean',
  'Vec',
  'i32',
  'i64',
  'usize',
])

const tokenPattern =
  /(\/\/.*|#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b)/g

function getTokenClass(token: string): string {
  if (token.startsWith('//') || token.startsWith('#')) {
    return 'token-comment'
  }

  if (
    token.startsWith('"') ||
    token.startsWith("'") ||
    token.startsWith('`')
  ) {
    return 'token-string'
  }

  if (/^\d/.test(token)) {
    return 'token-number'
  }

  if (typeNames.has(token)) {
    return 'token-type'
  }

  if (keywords.has(token)) {
    return 'token-keyword'
  }

  return ''
}

function getCharacterClasses(line: string): string[] {
  const classes = Array.from({ length: line.length }, () => '')

  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0]
    const start = match.index
    const tokenClass = getTokenClass(token)

    for (let index = start; index < start + token.length; index += 1) {
      classes[index] = tokenClass
    }
  }

  return classes
}

function EditorWindowComponent({
  snippet,
  cursor,
  error,
  complete,
  errorPulse,
  hasStarted,
  runId,
  copy,
}: EditorWindowProps) {
  const editorBodyRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const lines = snippet.code.split('\n')
  const cursorLineIndex = snippet.code.slice(0, cursor).split('\n').length - 1
  const lineRows = lines.reduce<EditorLine[]>((rows, line) => {
    const previous = rows.at(-1)
    const offset = previous ? previous.offset + previous.line.length + 1 : 0

    return [...rows, { line, offset }]
  }, [])

  useEffect(() => {
    const body = editorBodyRef.current

    if (!body) {
      return
    }

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'

    if (cursorLineIndex === 0) {
      body.scrollTo({ top: 0, behavior })
      return
    }

    const currentLine = body.children.item(cursorLineIndex)

    if (!(currentLine instanceof HTMLElement)) {
      return
    }

    const lineHeight = currentLine.getBoundingClientRect().height
    const bodyBottom =
      body.getBoundingClientRect().bottom -
      Number.parseFloat(window.getComputedStyle(body).paddingBottom)
    const lineBottom = currentLine.getBoundingClientRect().bottom
    const remainingSpace = bodyBottom - lineBottom
    const reservedSpace = lineHeight * 3

    if (remainingSpace < reservedSpace) {
      body.scrollBy({
        top: reservedSpace - remainingSpace,
        behavior,
      })
    }
  }, [cursorLineIndex, runId])

  useLayoutEffect(() => {
    const body = editorBodyRef.current
    const caret = caretRef.current

    if (!body || !caret) {
      return
    }

    const target =
      body.querySelector<HTMLElement>('.code-character.is-current') ??
      body.querySelector<HTMLElement>('.newline-target.is-current')

    if (!target || complete) {
      caret.style.opacity = '0'
      return
    }

    const bodyRect = body.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const caretRect = caret.getBoundingClientRect()
    const x =
      targetRect.left -
      bodyRect.left +
      body.scrollLeft +
      (targetRect.width - caretRect.width) / 2
    const y =
      targetRect.bottom - bodyRect.top + body.scrollTop - caretRect.height

    caret.style.transform = `translate3d(${x}px, ${y}px, 0)`
    caret.style.opacity = '1'
  }, [complete, cursor, cursorLineIndex, runId])

  useLayoutEffect(() => {
    const body = editorBodyRef.current

    if (
      errorPulse === 0 ||
      !body ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    const target =
      body.querySelector<HTMLElement>('.code-character.is-current') ??
      body.querySelector<HTMLElement>('.newline-target.is-current')

    if (!target) {
      return
    }

    const animation = target.animate(
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

    return () => animation.cancel()
  }, [errorPulse])

  return (
    <div className="editor-window">
      <div className="editor-toolbar">
        <div className="editor-file">
          <span
            className={`file-language-mark language-${snippet.languageId}`}
            aria-hidden="true"
          />
          <span>{snippet.filename}</span>
        </div>
        <span className="editor-mode">{copy.strictMode}</span>
      </div>
      <div
        ref={editorBodyRef}
        key={runId}
        className="editor-body"
        aria-label={`${snippet.language} ${copy.codeToType}`}
        role="group"
      >
        {lineRows.map(({ line, offset: currentOffset }, lineIndex) => {
          const characterClasses = getCharacterClasses(line)

          return (
            <div className="editor-line" key={`${lineIndex}-${line}`}>
              <span className="line-number" aria-hidden="true">
                {String(lineIndex + 1).padStart(2, '0')}
              </span>
              <span className="line-content">
                {Array.from(line).map((character, characterIndex) => {
                  const characterPosition = currentOffset + characterIndex
                  const isCorrect = characterPosition < cursor
                  const isCurrent = characterPosition === cursor

                  return (
                    <span
                      className={[
                        'code-character',
                        characterClasses[characterIndex],
                        isCorrect ? 'is-correct' : '',
                        isCurrent ? 'is-current' : '',
                        isCurrent && error ? 'is-error' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={characterPosition}
                      aria-hidden="true"
                    >
                      {character}
                    </span>
                  )
                })}
                {lineIndex < lines.length - 1 ? (
                  <span
                    className={[
                      'newline-target',
                      currentOffset + line.length === cursor ? 'is-current' : '',
                      currentOffset + line.length === cursor && error
                        ? 'is-error'
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  >
                    ↵
                  </span>
                ) : null}
              </span>
            </div>
          )
        })}
        <span
          ref={caretRef}
          className={[
            'editor-caret',
            hasStarted ? 'is-typing' : 'is-idle',
            error ? 'is-error' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        />
      </div>
      <div className="editor-statusbar">
        <div className="editor-status-left">
          <span>{snippet.language}</span>
          <span>UTF-8</span>
          <span>{snippet.indentation} {copy.spaces}</span>
        </div>
        <span
          className={
            error ? 'status-error' : complete ? 'status-ready' : undefined
          }
          aria-live="polite"
        >
          {error ? copy.incorrectKey : complete ? copy.complete : copy.ready}
        </span>
      </div>
      <span className="visually-hidden" aria-live="polite">
        {complete
          ? copy.snippetComplete
          : error
            ? copy.incorrectKeyHint
            : copy.snippetPosition(cursor, snippet.code.length)}
      </span>
    </div>
  )
}

export const EditorWindow = memo(EditorWindowComponent)
