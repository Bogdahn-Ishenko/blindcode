import { useEffect, useRef } from 'react'

const interactiveSelector =
  'button, a, select, .select-field, [data-cursor="pointer"]'

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(interactiveSelector) !== null
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current

    if (!cursor || !window.matchMedia('(pointer: fine)').matches) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frameId: number | null = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let hasPosition = false

    const setPosition = (x: number, y: number): void => {
      targetX = x
      targetY = y
      currentX = x
      currentY = y
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      hasPosition = true
    }

    const animate = (): void => {
      frameId = null
      const lerp = reducedMotion.matches ? 1 : 0.18
      currentX += (targetX - currentX) * lerp
      currentY += (targetY - currentY) * lerp
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`

      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frameId = window.requestAnimationFrame(animate)
        return
      }

      currentX = targetX
      currentY = targetY
      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
    }

    const moveCursor = (event: MouseEvent): void => {
      targetX = event.clientX
      targetY = event.clientY

      if (!hasPosition) {
        setPosition(targetX, targetY)
        cursor.classList.add('is-visible')
        return
      }

      if (frameId === null) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    const handleMouseEnter = (event: MouseEvent): void => {
      setPosition(event.clientX, event.clientY)
      cursor.classList.add('is-visible')
    }

    const handleMouseLeave = (): void => {
      cursor.classList.remove('is-visible', 'is-pointer', 'is-pressed')
      hasPosition = false

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
        frameId = null
      }
    }

    const handleDocumentMouseOut = (event: MouseEvent): void => {
      if (event.relatedTarget === null) {
        handleMouseLeave()
      }
    }

    const handleMouseOver = (event: MouseEvent): void => {
      if (!hasPosition) {
        setPosition(event.clientX, event.clientY)
        cursor.classList.add('is-visible')
      }

      if (isInteractiveTarget(event.target)) {
        cursor.classList.add('is-pointer')
      }
    }

    const handleMouseOut = (event: MouseEvent): void => {
      if (
        isInteractiveTarget(event.target) &&
        !isInteractiveTarget(event.relatedTarget)
      ) {
        cursor.classList.remove('is-pointer')
      }
    }

    const handleMouseDown = (event: MouseEvent): void => {
      if (event.button === 0) {
        if (!hasPosition) {
          setPosition(event.clientX, event.clientY)
          cursor.classList.add('is-visible')
        }

        cursor.classList.add('is-pressed')
      }
    }

    const handleMouseUp = (): void => {
      cursor.classList.remove('is-pressed')
    }

    const handleBlur = (): void => {
      handleMouseLeave()
    }

    document.addEventListener('mousemove', moveCursor, { passive: true })
    document.addEventListener('mouseout', handleDocumentMouseOut)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseout', handleDocumentMouseOut)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseenter', handleMouseEnter)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('blur', handleBlur)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <span ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="custom-cursor__shape" />
    </span>
  )
}
