import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ReaderBody from './ReaderBody'
import styles from './Reader.module.css'

export default function Reader({ item, open, onClose }) {
  const startXRef = useRef(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setClosing(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 240)
  }

  function handleTouchStart(e) {
    startXRef.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (startXRef.current === null) return
    const delta = e.changedTouches[0].clientX - startXRef.current
    if (delta < -60) handleClose()
    startXRef.current = null
  }

  if (!open && !closing) return null

  const isVisible = open && !closing

  return (
    <>
      {createPortal(
        <button
          className={`${styles.backBtn} ${isVisible ? styles.backVisible : ''}`}
          onClick={handleClose}
          aria-label="Retour"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour
        </button>,
        document.body
      )}
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} />
      <div
        className={`${styles.reader} ${isVisible ? styles.open : ''} ${closing ? styles.closing : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ReaderBody item={item} />
      </div>
    </>
  )
}
