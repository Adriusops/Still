import { useEffect, useRef } from 'react'
import ReaderHeader from './ReaderHeader'
import ReaderBody from './ReaderBody'
import styles from './Reader.module.css'

export default function Reader({ item, open, onClose }) {
  const startXRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleTouchStart(e) {
    startXRef.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (startXRef.current === null) return
    const delta = e.changedTouches[0].clientX - startXRef.current
    if (delta < -60) onClose()
    startXRef.current = null
  }

  return (
    <div
      className={`${styles.reader} ${open ? styles.open : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ReaderHeader onClose={onClose} />
      <ReaderBody item={item} />
    </div>
  )
}
