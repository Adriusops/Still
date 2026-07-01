import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ReaderBody from './ReaderBody'
import styles from './Reader.module.css'

const spring = { ease: [0.4, 0, 0.2, 1] }

export default function Reader({ item, open, onClose }) {
  const startXRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleTouchStart(e) {
    startXRef.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (startXRef.current === null) return
    const delta = e.changedTouches[0].clientX - startXRef.current
    if (Math.abs(delta) > 60) onClose()
    startXRef.current = null
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            className={styles.backBtn}
            onClick={onClose}
            aria-label="Retour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ...spring }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour
          </motion.button>

          <motion.div
            className={styles.reader}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.38, ...spring }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <ReaderBody item={item} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
