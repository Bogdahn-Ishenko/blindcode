import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'

export interface CustomSelectOption<Value extends string> {
  value: Value
  label: string
  indicatorClass?: string
}

interface CustomSelectProps<Value extends string> {
  label: string
  value: Value
  options: readonly CustomSelectOption<Value>[]
  onChange: (value: Value) => void
}

export function CustomSelect<Value extends string>({
  label,
  value,
  options,
  onChange,
}: CustomSelectProps<Value>) {
  const controlRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const selectedOption = options[selectedIndex]

  if (!selectedOption) {
    throw new Error(`Unknown option for selector: ${value}`)
  }

  const currentActiveIndex = activeIndex ?? selectedIndex

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        !(event.target instanceof Node) ||
        !controlRef.current?.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isOpen])

  const chooseOption = (index: number): void => {
    const option = options[index]

    if (!option) {
      return
    }

    onChange(option.value)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'Tab') {
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const baseIndex = isOpen ? currentActiveIndex : selectedIndex
      const nextIndex =
        (baseIndex + direction + options.length) % options.length

      setActiveIndex(nextIndex)
      setIsOpen(true)
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
      setIsOpen(true)
      return
    }

    if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault()
        setIsOpen(false)
      }

      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()

      if (isOpen) {
        chooseOption(currentActiveIndex)
      } else {
        setActiveIndex(selectedIndex)
        setIsOpen(true)
      }
    }
  }

  const handleBlur = (event: FocusEvent<HTMLButtonElement>): void => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !controlRef.current?.contains(event.relatedTarget)
    ) {
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={controlRef}
      className={`select-control ${isOpen ? 'is-open' : ''}`}
    >
      <button
        ref={triggerRef}
        className="select-field"
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${currentActiveIndex}` : undefined
        }
        onClick={() => {
          if (isOpen) {
            setIsOpen(false)
          } else {
            setActiveIndex(selectedIndex)
            setIsOpen(true)
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        <span className="select-field-label">
          {selectedOption.indicatorClass ? (
            <span
              key={selectedOption.indicatorClass}
              className={`language-indicator ${selectedOption.indicatorClass}`}
              aria-hidden="true"
            />
          ) : null}
          {label}
        </span>
        <span className="select-field-value">
          <span>{selectedOption.label}</span>
          <span className="select-chevron" aria-hidden="true" />
        </span>
      </button>
      <div
        id={listboxId}
        className="select-menu"
        role="listbox"
        aria-label={label}
        hidden={!isOpen}
      >
        {options.map((option, index) => (
          <div
            id={`${listboxId}-option-${index}`}
            className={[
              'select-option',
              index === currentActiveIndex ? 'is-active' : '',
              index === selectedIndex ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={option.value}
            role="option"
            aria-selected={index === selectedIndex}
            data-cursor="pointer"
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => chooseOption(index)}
          >
            {option.indicatorClass ? (
              <span
                className={`language-indicator ${option.indicatorClass}`}
                aria-hidden="true"
              />
            ) : null}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
