import styles from './ReaderHeader.module.css'

export default function ReaderHeader({ onClose }) {
  return (
    <button className={styles.back} onClick={onClose} aria-label="Retour">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Retour
    </button>
  )
}
